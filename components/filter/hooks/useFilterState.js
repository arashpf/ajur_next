// components/filter/hooks/useFilterState.js
import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import {
  parseFieldValues,
  parseNeighborhoodIds,
  parseFeatures,
  parseSort,
  buildQueryFromFilters,
  countActiveFilters,
} from "../utils/filterQuery";

export default function useFilterState({
  fieldSlugs = null,
  fieldTypes = {},
} = {}) {
  const router = useRouter();

  const fieldValues = useMemo(
    () => parseFieldValues(router.query, fieldSlugs, fieldTypes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.query, JSON.stringify(fieldSlugs), JSON.stringify(fieldTypes)]
  );

  const neighborhoodIds = useMemo(
    () => parseNeighborhoodIds(router.query),
    [router.query]
  );

  const features = useMemo(() => parseFeatures(router.query), [router.query]);

  const sortBy = useMemo(() => parseSort(router.query), [router.query]);

  const activeCount = useMemo(
    () =>
      countActiveFilters({
        fieldValues,
        neighborhoods: neighborhoodIds,
        features,
        sortBy,
      }),
    [fieldValues, neighborhoodIds, features, sortBy]
  );

  const pushQuery = useCallback(
    (next) => {
      const q = buildQueryFromFilters(router.query, {
        fieldValues: next.fieldValues ?? fieldValues,
        neighborhoods: next.neighborhoodIds ?? neighborhoodIds,
        features: next.features ?? features,
        sortBy: next.sortBy ?? sortBy,
        fieldTypes,
      });

      // Preserve non-filter keys that buildQueryFromFilters may have wiped
      Object.keys(router.query).forEach((k) => {
        if (
          !k.endsWith("_min") &&
          !k.endsWith("_max") &&
          k !== "neighborhoods" &&
          k !== "features" &&
          k !== "sortBy" &&
          k !== "page" &&
          !Object.prototype.hasOwnProperty.call(fieldTypes, k)
        ) {
          q[k] = router.query[k];
        }
      });

      router.push(
        { pathname: router.pathname, query: q },
        undefined,
        { shallow: true, scroll: false }
      );
    },
    [router, fieldValues, neighborhoodIds, features, sortBy, fieldTypes]
  );

  const update = useCallback(
    (partial) => {
      pushQuery({
        fieldValues:
          partial.fieldValues !== undefined ? partial.fieldValues : fieldValues,
        neighborhoodIds:
          partial.neighborhoodIds !== undefined
            ? partial.neighborhoodIds
            : neighborhoodIds,
        features:
          partial.features !== undefined ? partial.features : features,
        sortBy: partial.sortBy !== undefined ? partial.sortBy : sortBy,
      });
    },
    [pushQuery, fieldValues, neighborhoodIds, features, sortBy]
  );

  const resetAll = useCallback(() => {
    pushQuery({
      fieldValues: {},
      neighborhoodIds: [],
      features: [],
      sortBy: "newest",
    });
  }, [pushQuery]);

  return {
    fieldValues,
    neighborhoodIds,
    features,
    sortBy,
    activeCount,
    update,
    resetAll,
  };
}