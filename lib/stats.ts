import { data } from "@/data/data";

interface Names {
  name: string;
  nameAr: string;
}

export interface DataStats {
  governorates: number;
  delegations: number;
  localities: number;
  postalCodes: number;
  /** A real slice of the first governorate, used to draw the hierarchy. */
  sample: {
    governorate: Names & { delegationCount: number };
    delegations: (Names & { localityCount: number })[];
    localities: (Names & { postalCode: string })[];
  };
}

// "ARIANA VILLE (Residence Kortoba)" -> ["ARIANA VILLE", "Residence Kortoba"]
function splitLocality(value: string): [string, string] {
  const match = value.match(/^(.*?)\s*\((.*)\)$/);
  return match ? [match[1], match[2]] : [value, value];
}

/** Counts computed from the dataset so the page never drifts from the API. */
export function getDataStats(): DataStats {
  const delegations = new Set<string>();
  const postalCodes = new Set<string>();
  let localities = 0;

  for (const governorate of data) {
    for (const entry of governorate.Delegations) {
      delegations.add(`${governorate.Value}/${entry.Value}`);
      postalCodes.add(entry.PostalCode);
      localities++;
    }
  }

  const governorate = data[0];
  const byDelegation = new Map<string, typeof governorate.Delegations>();
  for (const entry of governorate.Delegations) {
    const list = byDelegation.get(entry.Value) ?? [];
    list.push(entry);
    byDelegation.set(entry.Value, list);
  }
  const groups = [...byDelegation.values()];

  return {
    governorates: data.length,
    delegations: delegations.size,
    localities,
    postalCodes: postalCodes.size,
    sample: {
      governorate: {
        name: governorate.Name,
        nameAr: governorate.NameAr,
        delegationCount: groups.length,
      },
      delegations: groups.slice(0, 2).map((entries) => ({
        name: entries[0].Value,
        nameAr: splitLocality(entries[0].NameAr)[0],
        localityCount: entries.length,
      })),
      localities: groups[0].slice(0, 2).map((entry) => ({
        name: splitLocality(entry.Name)[1],
        nameAr: splitLocality(entry.NameAr)[1],
        postalCode: entry.PostalCode,
      })),
    },
  };
}
