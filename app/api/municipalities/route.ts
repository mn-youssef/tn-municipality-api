import { data } from "@/data/data";
import { NextResponse } from "next/server";

/**
 * Interface for municipality data structure
 */
interface Municipality {
  Name: string;
  NameAr: string;
  Value: string;
  Delegations: Delegation[];
}

interface Delegation {
  Name: string;
  NameAr: string;
  Value: string;
  PostalCode: string;
  Latitude: number;
  Longitude: number;
}

/**
 * Searches for municipalities by governorate name
 * @param searchTerm - The search term to match against governorate names
 * @param municipalities - Array of municipality data
 * @returns Filtered array of municipalities
 */
function searchByGovernorate(
  searchTerm: string,
  municipalities: Municipality[],
): Municipality[] {
  return municipalities.filter(
    (item) =>
      item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.NameAr.toLowerCase().includes(searchTerm.toLowerCase()),
  );
}

/**
 * Searches for municipalities by delegation name
 * @param searchTerm - The search term to match against delegation names
 * @param municipalities - Array of municipality data
 * @returns Filtered array of municipalities with matching delegations
 */
function searchByDelegation(
  searchTerm: string,
  municipalities: Municipality[],
): Municipality[] {
  return municipalities
    .map((item) => ({
      ...item,
      Delegations: item.Delegations.filter(
        (d) =>
          d.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.NameAr.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((item) => item.Delegations.length > 0);
}

/**
 * Enhanced search with fallback mechanism
 * First tries to search by governorate name, if no results found,
 * falls back to searching by delegation name and vice versa
 * @param searchTerm - The search term
 * @param searchType - Primary search type ('governorate' or 'delegation')
 * @param municipalities - Array of municipality data
 * @returns Search results with fallback applied if needed
 */
function enhancedSearch(
  searchTerm: string,
  searchType: "governorate" | "delegation",
  municipalities: Municipality[],
): { results: Municipality[]; searchUsed: string; fallbackApplied: boolean } {
  let results: Municipality[] = [];
  let fallbackApplied = false;
  let searchUsed: string = searchType;

  if (searchType === "governorate") {
    // Primary search: by governorate
    results = searchByGovernorate(searchTerm, municipalities);

    // Fallback: if no results, try delegation search
    if (results.length === 0) {
      results = searchByDelegation(searchTerm, municipalities);
      fallbackApplied = true;
      searchUsed = "delegation (fallback)";
    }
  } else {
    // Primary search: by delegation
    results = searchByDelegation(searchTerm, municipalities);

    // Fallback: if no results, try governorate search
    if (results.length === 0) {
      results = searchByGovernorate(searchTerm, municipalities);
      fallbackApplied = true;
      searchUsed = "governorate (fallback)";
    }
  }

  return { results, searchUsed, fallbackApplied };
}

/**
 * Filters municipalities by postal code
 * @param postalCode - The postal code to search for
 * @param municipalities - Array of municipality data
 * @returns Filtered array of municipalities with matching postal codes
 */
function filterByPostalCode(
  postalCode: string,
  municipalities: Municipality[],
): Municipality[] {
  return municipalities
    .map((item) => ({
      ...item,
      Delegations: item.Delegations.filter((d) => d.PostalCode === postalCode),
    }))
    .filter((item) => item.Delegations.length > 0);
}

/**
 * Sorts municipalities by specified field and order
 * @param municipalities - Array of municipality data to sort
 * @param sortField - Field to sort by ('name' or 'nameAr')
 * @param sortOrder - Sort order ('asc' or 'desc')
 * @returns Sorted array of municipalities
 */
function sortMunicipalities(
  municipalities: Municipality[],
  sortField: string,
  sortOrder: string = "asc",
): Municipality[] {
  return municipalities.sort((a, b) => {
    let fieldA: string;
    let fieldB: string;

    if (sortField === "name") {
      fieldA = a.Name.toLowerCase();
      fieldB = b.Name.toLowerCase();
      return sortOrder === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    } else if (sortField === "nameAr") {
      fieldA = a.NameAr.toLowerCase();
      fieldB = b.NameAr.toLowerCase();
      return sortOrder === "asc"
        ? fieldA.localeCompare(fieldB, "ar")
        : fieldB.localeCompare(fieldA, "ar");
    }

    return 0;
  });
}

/**
 * Removes duplicate delegations using (Name + PostalCode) as unique key
 * - Case-insensitive on Name
 * - Keeps the first occurrence
 */
function deduplicateDelegations(delegations: Delegation[]): Delegation[] {
  const seen = new Set<string>();

  return delegations.filter((d) => {
    const key = `${d.Name.toLowerCase().trim()}|${d.PostalCode}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

/**
 * Removes duplicate delegations inside each municipality
 */
function deduplicateMunicipalities(
  municipalities: Municipality[],
): Municipality[] {
  return municipalities.map((m) => ({
    ...m,
    Delegations: deduplicateDelegations(m.Delegations),
  }));
}

/**
 * GET endpoint for municipalities API
 *
 * Supports the following query parameters:
 * - search: Unified search that tries governorate first, then delegation as fallback
 * - name: Search by governorate name (with delegation fallback) - legacy support
 * - delegation: Search by delegation name (with governorate fallback) - legacy support
 * - postalCode: Filter by exact postal code match
 * - sort: Sort field ('name' or 'nameAr')
 * - order: Sort order ('asc' or 'desc', defaults to 'asc')
 *
 * Search behavior:
 * - Searches are case-insensitive
 * - Supports both English and Arabic names
 * - Automatic fallback between governorate and delegation searches
 * - If searching by governorate fails, automatically tries delegation search
 * - If searching by delegation fails, automatically tries governorate search
 *
 * @param request - The incoming HTTP request
 * @returns JSON response with filtered and sorted municipality data
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let results: Municipality[] = [...data]; // Create a copy to avoid mutations

    // Enhanced search with fallback mechanism
    const name = searchParams.get("name");
    const delegation = searchParams.get("delegation");
    const search = searchParams.get("search"); // New unified search parameter

    // Unified search parameter with automatic fallback
    if (search) {
      const searchResult = enhancedSearch(search, "governorate", results);
      results = searchResult.results;

      // Log search information for debugging (could be useful for analytics)
      console.log(
        `Search: "${search}" - Used: ${searchResult.searchUsed}, Fallback: ${searchResult.fallbackApplied}, Results: ${results.length}`,
      );
    }
    // Legacy support: individual name parameter (governorate search with delegation fallback)
    else if (name) {
      const searchResult = enhancedSearch(name, "governorate", results);
      results = searchResult.results;

      console.log(
        `Name search: "${name}" - Used: ${searchResult.searchUsed}, Fallback: ${searchResult.fallbackApplied}, Results: ${results.length}`,
      );
    }
    // Legacy support: individual delegation parameter (delegation search with governorate fallback)
    else if (delegation) {
      const searchResult = enhancedSearch(delegation, "delegation", results);
      results = searchResult.results;

      console.log(
        `Delegation search: "${delegation}" - Used: ${searchResult.searchUsed}, Fallback: ${searchResult.fallbackApplied}, Results: ${results.length}`,
      );
    }

    // Filtering by PostalCode (delegation postal code)
    const postalCode = searchParams.get("postalCode");
    if (postalCode) {
      results = filterByPostalCode(postalCode, results);
    }

    // Sorting by Name (governorate) alphabetically or by NameAr (Arabic name)
    const sortingField = searchParams.get("sort");
    const sortOrder = searchParams.get("order") || "asc";
    if (
      sortingField &&
      (sortingField === "name" || sortingField === "nameAr")
    ) {
      results = sortMunicipalities(results, sortingField, sortOrder);
    }

    // Deduplicate delegations inside each municipality
    results = deduplicateMunicipalities(results);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in municipalities API:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to process request" },
      { status: 500 },
    );
  }
}
