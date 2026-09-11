import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";

import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";

import CallIcon from "@mui/icons-material/Call";
import TourOutlinedIcon from "@mui/icons-material/TourOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";

import Styles from "../../components/styles/RealstateSingle.module.css";
import WorkerCard from "../../components/cards/WorkerCard";
import RealstateCard from "../../components/cards/realestate/RealStateCard";
import RealstateSkeleton from "../../components/skeleton/RealstateSkeleton";
import SpinnerModalLoader from "../../components/panel/SpinnerModalLoader";
import LazyLoader from "../../components/lazyLoader/Loading";

const SITE_URL = "https://ajur.app";

const API_URL =
  "https://api.ajur.app/api/realstate-front-workers";

const CATEGORY_FIELDS_API =
  "https://api.ajur.app/api/category-fields";

const TRACK_CALL_API =
  "https://api.ajur.app/api/track/agent-call";

const DEFAULT_META_IMAGE =
  `${SITE_URL}/logo/ajour-meta-image.jpg`;

const REQUEST_TIMEOUT = 15000;
const WORKERS_PER_PAGE = 6;

/**
 * Convert values returned by Laravel into JSON-safe Next.js props.
 */
const makeSerializable = (
  value,
  fallback = null
) => {
  try {
    return JSON.parse(
      JSON.stringify(value ?? fallback)
    );
  } catch {
    return fallback;
  }
};

/**
 * Convert a relative API image path into an absolute URL.
 */
const getAbsoluteUrl = (value) => {
  if (
    !value ||
    typeof value !== "string"
  ) {
    return "";
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "";
  }

  if (
    normalizedValue.startsWith("https://") ||
    normalizedValue.startsWith("http://")
  ) {
    return normalizedValue;
  }

  if (normalizedValue.startsWith("//")) {
    return `https:${normalizedValue}`;
  }

  if (normalizedValue.startsWith("/")) {
    return `${SITE_URL}${normalizedValue}`;
  }

  return `${SITE_URL}/${normalizedValue}`;
};

/**
 * Return the first nonempty string from a collection of candidates.
 */
const getFirstText = (...values) => {
  const result = values.find(
    (value) =>
      typeof value === "string" &&
      value.trim().length > 0
  );

  return result ? result.trim() : "";
};

/**
 * Convert numbers and numeric strings safely.
 */
const toNumber = (
  value,
  fallback = 0
) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

/**
 * Strip HTML and normalize whitespace for metadata.
 */
const normalizeText = (value) => {
  if (
    !value ||
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Limit metadata length.
 */
const limitText = (
  value,
  maxLength
) => {
  const normalizedValue =
    normalizeText(value);

  if (
    normalizedValue.length <= maxLength
  ) {
    return normalizedValue;
  }

  return `${normalizedValue
    .slice(0, maxLength - 1)
    .trim()}…`;
};

/**
 * Build a person's full name from separate name fields.
 */
const buildPersonName = (
  firstName,
  lastName
) => {
  const parts = [
    firstName,
    lastName,
  ]
    .filter(
      (value) =>
        typeof value === "string" &&
        value.trim().length > 0
    )
    .map((value) => value.trim());

  return [...new Set(parts)]
    .join(" ")
    .trim();
};

/**
 * Determine the agent's personal name.
 *
 * Person fields have priority because the person is the primary
 * entity of this page. Agency-related fields must not be used here.
 */
const getAgentName = (realstate) => {
  if (!realstate) {
    return "";
  }

  const personName = buildPersonName(
    getFirstText(
      realstate?.first_name,
      realstate?.name
    ),
    getFirstText(
      realstate?.last_name,
      realstate?.family
    )
  );

  const nestedUserName =
    buildPersonName(
      getFirstText(
        realstate?.user?.first_name,
        realstate?.user?.name
      ),
      getFirstText(
        realstate?.user?.last_name,
        realstate?.user?.family
      )
    );

  return getFirstText(
    realstate?.full_name,
    realstate?.agent_name,
    realstate?.consultant_name,
    realstate?.worker_name,
    realstate?.user?.full_name,
    personName,
    nestedUserName,
    realstate?.title
  );
};

/**
 * Determine the associated real-estate agency name.
 *
 * The agency is a secondary entity connected to the person.
 */
const getAgencyName = (realstate) => {
  if (!realstate) {
    return "";
  }

  return getFirstText(
    realstate?.agency?.name,
    realstate?.agency?.title,
    realstate?.office?.name,
    realstate?.office?.title,
    realstate?.realstate,
    realstate?.realstate_name,
    realstate?.office_name,
    realstate?.agency_name
  );
};

/**
 * Determine the Persian city name.
 */
const getCityName = (realstate) => {
  if (!realstate) {
    return "";
  }

  return getFirstText(
    realstate?.city?.title,
    realstate?.city?.name,
    realstate?.city_title,
    realstate?.city_name,
    typeof realstate?.city === "string"
      ? realstate.city
      : ""
  );
};

/**
 * Determine the neighborhood name.
 */
const getNeighborhoodName = (
  realstate
) => {
  if (!realstate) {
    return "";
  }

  return getFirstText(
    realstate?.neighborhood?.title,
    realstate?.neighborhood?.name,
    realstate?.neighborhood_title,
    realstate?.neighborhood_name,
    typeof realstate?.neighborhood ===
      "string"
      ? realstate.neighborhood
      : ""
  );
};

/**
 * Determine the agent's actual profile image.
 *
 * The default Ajur social image is deliberately excluded here.
 */
const getAgentImage = (realstate) => {
  if (!realstate) {
    return "";
  }

  return getAbsoluteUrl(
    getFirstText(
      realstate?.profile_url,
      realstate?.profile_image,
      realstate?.image_url,
      realstate?.image,
      realstate?.avatar,
      realstate?.user?.profile_url,
      realstate?.user?.profile_image,
      realstate?.user?.image,
      realstate?.user?.avatar
    )
  );
};

/**
 * Create an SEO-friendly display name for a property.
 */
const getWorkerName = (worker) => {
  if (!worker) {
    return "فایل ملکی";
  }

  return (
    getFirstText(
      worker?.title,
      worker?.name,
      worker?.category?.name,
      worker?.category_name,
      worker?.slug
    ) || "فایل ملکی"
  );
};

/**
 * Create a crawlable, query-free property URL.
 */
const getWorkerUrl = (worker) => {
  if (!worker?.id) {
    return "";
  }

  return `${SITE_URL}/worker/${encodeURIComponent(
    String(worker.id)
  )}`;
};

const RealestateSingle = ({
  pageId,
  canonicalPath,
  initialRealstate,
  initialWorkers,
  initialSubcategories,
  initialServerError,
}) => {
  const realstate = initialRealstate;

  const [loading] = useState(false);

  const [allWorkers] = useState(
    Array.isArray(initialWorkers)
      ? initialWorkers
      : []
  );

  const [categories] = useState(
    Array.isArray(initialSubcategories)
      ? initialSubcategories
      : []
  );

  const [
    selectedCategoryId,
    setSelectedCategoryId,
  ] = useState(null);

  const [
    selectedCategoryName,
    setSelectedCategoryName,
  ] = useState("");

  const [
    showFiltersStatus,
    setShowFiltersStatus,
  ] = useState(false);

  const [
    normalFields,
    setNormalFields,
  ] = useState([]);

  const [
    predefinedFields,
    setPredefinedFields,
  ] = useState([]);

  const [
    tickFields,
    setTickFields,
  ] = useState([]);

  const [
    loadingCategoryFields,
    setLoadingCategoryFields,
  ] = useState(false);

  const [
    openModal,
    setOpenModal,
  ] = useState(false);

  const [
    modalType,
    setModalType,
  ] = useState("filters");

  const categoryRequestRef =
    useRef(null);

  /**
   * The canonical path is produced on the server from the actual
   * request URL. Query parameters are intentionally removed.
   */
  const canonical = useMemo(() => {
    const normalizedPath =
      canonicalPath &&
      canonicalPath !== "/"
        ? canonicalPath.replace(
            /\/+$/,
            ""
          )
        : canonicalPath || "/";

    return `${SITE_URL}${normalizedPath}`;
  }, [canonicalPath]);

  /**
   * Personal name of the agent.
   */
  const agentName = useMemo(
    () => getAgentName(realstate),
    [realstate]
  );

  /**
   * Agency/office name associated with the person.
   */
  const agencyName = useMemo(
    () => getAgencyName(realstate),
    [realstate]
  );

  const cityName = useMemo(
    () => getCityName(realstate),
    [realstate]
  );

  const neighborhoodName = useMemo(
    () =>
      getNeighborhoodName(realstate),
    [realstate]
  );

  /**
   * Keep the actual agent image separate from Ajur's default image.
   *
   * The default image may be used for social sharing, but it must not
   * be presented to Google as the person's actual photograph.
   */
  const agentProfileImage = useMemo(
    () => getAgentImage(realstate),
    [realstate]
  );

  const socialImage =
    agentProfileImage ||
    DEFAULT_META_IMAGE;

  const phone = getFirstText(
    realstate?.phone,
    realstate?.mobile,
    realstate?.telephone
  );

  const address = getFirstText(
    realstate?.address,
    realstate?.full_address
  );

  const agentDescription =
    normalizeText(
      getFirstText(
        realstate?.description,
        realstate?.about,
        realstate?.bio
      )
    );

  const pageAvailable =
    !initialServerError &&
    Boolean(realstate?.id) &&
    Boolean(agentName);

  /**
   * Descriptive text for the actual profile image.
   *
   * Example:
   * رضا ترکمان، مشاور املاک هخامنش در پرند
   */
  const agentImageAlt = useMemo(() => {
    if (!agentName) {
      return "مشاور املاک در آجر";
    }

    if (agencyName && cityName) {
      return `${agentName}، ${agencyName} در ${cityName}`;
    }

    if (agencyName) {
      return `${agentName}، ${agencyName}`;
    }

    if (cityName) {
      return `${agentName}، مشاور املاک در ${cityName}`;
    }

    return `${agentName}، مشاور املاک`;
  }, [
    agentName,
    agencyName,
    cityName,
  ]);

  /**
   * Human-readable page heading.
   */
  const pageHeading = useMemo(() => {
    if (agencyName) {
      return `${agentName}، ${agencyName}`;
    }

    if (cityName) {
      return `${agentName}، مشاور املاک در ${cityName}`;
    }

    return `${agentName}، مشاور املاک`;
  }, [
    agentName,
    agencyName,
    cityName,
  ]);

  /**
   * SEO title and description are fully available during SSR.
   *
   * Primary entity: person
   * Secondary entity: agency
   */
  const seoData = useMemo(() => {
    if (!pageAvailable) {
      return {
        title: "مشاور املاک | آجر",
        description:
          "مشاهده اطلاعات مشاوران املاک و فایل‌های ملکی در سامانه املاک آجر.",
        canonical,
        image: DEFAULT_META_IMAGE,
        imageAlt:
          "مشاوران املاک در آجر",
      };
    }

    /**
     * Preferred result:
     * رضا ترکمان، مشاور املاک هخامنش | آجر
     */
    let title = "";

    if (agencyName) {
      title =
        `${agentName}، ${agencyName} | آجر`;
    } else if (cityName) {
      title =
        `${agentName}، مشاور املاک در ${cityName} | آجر`;
    } else {
      title =
        `${agentName}، مشاور املاک | آجر`;
    }

    let description = "";

    if (agencyName && cityName) {
      description =
        `اطلاعات تماس، معرفی و فایل‌های ملکی ${agentName}، ` +
        `مشاور فعال در ${agencyName} در ${cityName} را در آجر مشاهده کنید.`;
    } else if (agencyName) {
      description =
        `اطلاعات تماس، معرفی و فایل‌های ملکی ${agentName}، ` +
        `مشاور فعال در ${agencyName} را در آجر مشاهده کنید.`;
    } else if (cityName) {
      description =
        `اطلاعات تماس، معرفی و فایل‌های ملکی ${agentName}، ` +
        `مشاور املاک در ${cityName} را در آجر مشاهده کنید.`;
    } else {
      description =
        `اطلاعات تماس، معرفی و فایل‌های ملکی ${agentName} ` +
        `را در سامانه املاک آجر مشاهده کنید.`;
    }

    /**
     * Append a short biography only when enough metadata space remains.
     */
    if (agentDescription) {
      const remainingLength =
        Math.max(
          0,
          155 -
            description.length -
            1
        );

      if (remainingLength >= 30) {
        description =
          `${description} ${limitText(
            agentDescription,
            remainingLength
          )}`;
      }
    }

    return {
      title: limitText(title, 65),
      description: limitText(
        description,
        160
      ),
      canonical,
      image: socialImage,
      imageAlt: agentImageAlt,
    };
  }, [
    agentDescription,
    agentImageAlt,
    agentName,
    agencyName,
    canonical,
    cityName,
    pageAvailable,
    socialImage,
  ]);

  const robotsContent =
    pageAvailable
      ? "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
      : "noindex,follow";

  /**
   * Fetch interactive category filter fields on the client.
   */
  useEffect(() => {
    if (
      !selectedCategoryId ||
      selectedCategoryId === "all"
    ) {
      setNormalFields([]);
      setTickFields([]);
      setPredefinedFields([]);

      return undefined;
    }

    if (
      categoryRequestRef.current
    ) {
      categoryRequestRef.current.abort();
    }

    const controller =
      new AbortController();

    categoryRequestRef.current =
      controller;

    const fetchCategoryFields =
      async () => {
        try {
          setLoadingCategoryFields(
            true
          );

          const response =
            await axios.get(
              CATEGORY_FIELDS_API,
              {
                params: {
                  cat: selectedCategoryId,
                },
                timeout:
                  REQUEST_TIMEOUT,
                signal:
                  controller.signal,
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          const returnedNormalFields =
            response.data
              ?.normal_fields;

          setNormalFields(
            Array.isArray(
              returnedNormalFields
            )
              ? returnedNormalFields.map(
                  (field) => ({
                    ...field,
                    low: toNumber(
                      field?.low,
                      0
                    ),
                    high: toNumber(
                      field?.high,
                      0
                    ),
                  })
                )
              : []
          );

          setTickFields(
            Array.isArray(
              response.data
                ?.tick_fields
            )
              ? response.data
                  .tick_fields
              : []
          );

          setPredefinedFields(
            Array.isArray(
              response.data
                ?.predefine_fields
            )
              ? response.data
                  .predefine_fields
              : []
          );
        } catch (error) {
          const requestWasCanceled =
            error?.code ===
              "ERR_CANCELED" ||
            error?.name ===
              "CanceledError" ||
            axios.isCancel?.(error);

          if (
            !requestWasCanceled
          ) {
            console.error(
              "Category fields request failed:",
              error
            );

            setNormalFields([]);
            setTickFields([]);
            setPredefinedFields([]);
          }
        } finally {
          if (
            !controller.signal
              .aborted
          ) {
            setLoadingCategoryFields(
              false
            );
          }
        }
      };

    fetchCategoryFields();

    return () => {
      controller.abort();
    };
  }, [selectedCategoryId]);

  /**
   * Cancel any active request when leaving the page.
   */
  useEffect(() => {
    return () => {
      if (
        categoryRequestRef.current
      ) {
        categoryRequestRef.current.abort();
      }
    };
  }, []);

  const isWorkerInRange = (
    worker
  ) => {
    const selectedRangeFields =
      normalFields.filter(
        (field) =>
          Number(field?.special) ===
            1 &&
          (toNumber(
            field?.low,
            0
          ) > 0 ||
            toNumber(
              field?.high,
              0
            ) > 0)
      );

    /**
     * No active numeric filter means the property remains visible.
     */
    if (
      selectedRangeFields.length === 0
    ) {
      return true;
    }

    if (
      !worker?.json_properties
    ) {
      return false;
    }

    try {
      const decodedProperties =
        typeof worker.json_properties ===
        "string"
          ? JSON.parse(
              worker.json_properties
            )
          : worker.json_properties;

      if (
        !Array.isArray(
          decodedProperties
        )
      ) {
        return false;
      }

      const specialProperties =
        decodedProperties.filter(
          (property) =>
            Number(
              property?.special
            ) === 1
        );

      return selectedRangeFields.every(
        (field) => {
          const matchingProperty =
            specialProperties.find(
              (property) =>
                property?.name ===
                field?.value
            );

          if (!matchingProperty) {
            return false;
          }

          const workerValue =
            toNumber(
              matchingProperty?.value,
              Number.NaN
            );

          if (
            !Number.isFinite(
              workerValue
            )
          ) {
            return false;
          }

          const lower =
            toNumber(
              field?.low,
              0
            ) > 0
              ? toNumber(field.low)
              : toNumber(
                  field?.min_range,
                  Number.NEGATIVE_INFINITY
                );

          const higher =
            toNumber(
              field?.high,
              0
            ) > 0
              ? toNumber(field.high)
              : toNumber(
                  field?.max_range,
                  Number.POSITIVE_INFINITY
                );

          return (
            workerValue >= lower &&
            workerValue <= higher
          );
        }
      );
    } catch (error) {
      console.error(
        "Error parsing worker properties:",
        error
      );

      return false;
    }
  };

  /**
   * The displayed property list is derived from the SSR list.
   */
  const filteredWorkers =
    useMemo(() => {
      let result = [...allWorkers];

      if (
        selectedCategoryId &&
        selectedCategoryId !== "all"
      ) {
        result = result.filter(
          (worker) =>
            String(
              worker?.category_id
            ) ===
            String(
              selectedCategoryId
            )
        );
      }

      return result.filter(
        isWorkerInRange
      );
    }, [
      allWorkers,
      normalFields,
      selectedCategoryId,
    ]);

  const activeFiltersCount =
    useMemo(
      () =>
        normalFields.filter(
          (field) =>
            Number(
              field?.special
            ) === 1 &&
            (toNumber(
              field?.low,
              0
            ) > 0 ||
              toNumber(
                field?.high,
                0
              ) > 0)
        ).length,
      [normalFields]
    );

  const numberFormatter = (
    value
  ) => {
    const number =
      toNumber(value);

    if (
      number >= 1_000_000_000
    ) {
      return `${(
        number / 1_000_000_000
      ).toFixed(1)} میلیارد`;
    }

    if (
      number >= 1_000_000
    ) {
      return `${(
        number / 1_000_000
      ).toFixed(0)} میلیون`;
    }

    if (number >= 1_000) {
      return `${(
        number / 1_000
      ).toFixed(0)} هزار`;
    }

    return String(number);
  };

  const handleCategorySelect = (
    category
  ) => {
    if (!category) {
      return;
    }

    if (category === "all") {
      setSelectedCategoryId(
        "all"
      );
      setSelectedCategoryName(
        "همه فایل‌ها"
      );
      setShowFiltersStatus(false);
      setNormalFields([]);

      return;
    }

    setSelectedCategoryId(
      category.id
    );

    setSelectedCategoryName(
      category.name ||
        category.title ||
        ""
    );

    setShowFiltersStatus(true);
  };

  const deleteFieldFilter = (
    fieldId
  ) => {
    setNormalFields(
      (currentFields) =>
        currentFields.map((field) =>
          String(field.id) ===
          String(fieldId)
            ? {
                ...field,
                low: 0,
                high: 0,
              }
            : field
        )
    );
  };

  const handleSliderChange = (
    fieldId,
    newValue
  ) => {
    if (
      !Array.isArray(newValue) ||
      newValue.length !== 2
    ) {
      return;
    }

    setNormalFields(
      (currentFields) =>
        currentFields.map((field) =>
          String(field.id) ===
          String(fieldId)
            ? {
                ...field,
                low: newValue[0],
                high: newValue[1],
              }
            : field
        )
    );
  };

  const resetFieldsFilterForm =
    () => {
      setNormalFields(
        (currentFields) =>
          currentFields.map(
            (field) => ({
              ...field,
              low: 0,
              high: 0,
            })
          )
      );
    };

  const openFiltersSelection =
    () => {
      setModalType("filters");
      setOpenModal(true);
    };

  const closeModal = () => {
    setOpenModal(false);
  };

  const confirmFilteringFields =
    () => {
      setOpenModal(false);
    };

  const handleCall = async (
    agentId,
    agentPhone
  ) => {
    if (!agentPhone) {
      return;
    }

    try {
      await axios.post(
        TRACK_CALL_API,
        {
          agent_id: agentId,
        },
        {
          timeout: REQUEST_TIMEOUT,
          headers: {
            Accept:
              "application/json",
          },
        }
      );
    } catch (error) {
      /**
       * Tracking failure must never prevent the call.
       */
      console.error(
        "Call tracking error:",
        error
      );
    } finally {
      window.location.href =
        `tel:${agentPhone}`;
    }
  };

  /**
   * Structured data.
   *
   * Person is the primary entity.
   * RealEstateAgent represents the associated agency.
   */
  const jsonLd = useMemo(() => {
    if (!pageAvailable) {
      return null;
    }

    const personId =
      `${canonical}#person`;

    const agencyId =
      `${canonical}#agency`;

    const profileImageId =
      `${canonical}#profile-image`;

    const pageSchemaId =
      `${canonical}#webpage`;

    const breadcrumbId =
      `${canonical}#breadcrumb`;

    const listingsId =
      `${canonical}#property-list`;

    const postalAddress = {
      "@type": "PostalAddress",
      addressCountry: "IR",

      ...(cityName
        ? {
            addressLocality:
              cityName,
          }
        : {}),

      ...(neighborhoodName
        ? {
            addressRegion:
              neighborhoodName,
          }
        : {}),

      ...(address
        ? {
            streetAddress:
              address,
          }
        : {}),
    };

    const itemListElements =
      allWorkers
        .slice(0, 20)
        .map(
          (worker, index) => {
            const workerUrl =
              getWorkerUrl(worker);

            return {
              "@type": "ListItem",
              position: index + 1,
              name: getWorkerName(
                worker
              ),

              ...(workerUrl
                ? {
                    url: workerUrl,
                  }
                : {}),
            };
          }
        );

    const profilePageSchema = {
      "@type": "ProfilePage",
      "@id": pageSchemaId,
      url: canonical,
      name: seoData.title,
      headline: pageHeading,
      description:
        seoData.description,
      inLanguage: "fa-IR",

      isPartOf: {
        "@id":
          `${SITE_URL}/#website`,
      },

      mainEntity: {
        "@id": personId,
      },

      breadcrumb: {
        "@id": breadcrumbId,
      },

      ...(agentProfileImage
        ? {
            primaryImageOfPage: {
              "@id":
                profileImageId,
            },
          }
        : {}),

      ...(realstate?.created_at
        ? {
            dateCreated:
              realstate.created_at,
          }
        : {}),

      ...(realstate?.updated_at
        ? {
            dateModified:
              realstate.updated_at,
          }
        : {}),
    };

    /**
     * Person is the primary indexed entity.
     */
    const personSchema = {
      "@type": "Person",
      "@id": personId,
      name: agentName,
      url: canonical,
      jobTitle: "مشاور املاک",
      description:
        seoData.description,

      mainEntityOfPage: {
        "@id": pageSchemaId,
      },

      ...(phone
        ? {
            telephone: phone,
          }
        : {}),

      ...(agentProfileImage
        ? {
            image: {
              "@id":
                profileImageId,
            },
          }
        : {}),

      ...(agencyName
        ? {
            worksFor: {
              "@id": agencyId,
            },

            affiliation: {
              "@id": agencyId,
            },
          }
        : {}),

      ...(cityName
        ? {
            workLocation: {
              "@type": "Place",
              name: cityName,

              ...(address
                ? {
                    address:
                      postalAddress,
                  }
                : {}),
            },
          }
        : {}),

      subjectOf: {
        "@id": listingsId,
      },
    };

    /**
     * There is no separate agency page yet.
     *
     * Therefore, this agency receives a fragment ID on the person's
     * canonical page instead of receiving the person's URL as its own URL.
     */
    const agencySchema =
      agencyName
        ? {
            "@type":
              "RealEstateAgent",
            "@id": agencyId,
            name: agencyName,

            ...(phone
              ? {
                  telephone:
                    phone,
                }
              : {}),

            ...(cityName ||
            neighborhoodName ||
            address
              ? {
                  address:
                    postalAddress,
                }
              : {}),

            ...(cityName
              ? {
                  areaServed: {
                    "@type":
                      "City",
                    name: cityName,
                  },
                }
              : {}),

            ...(realstate?.latitude &&
            realstate?.longitude
              ? {
                  geo: {
                    "@type":
                      "GeoCoordinates",
                    latitude:
                      toNumber(
                        realstate.latitude
                      ),
                    longitude:
                      toNumber(
                        realstate.longitude
                      ),
                  },
                }
              : {}),

            employee: {
              "@id": personId,
            },
          }
        : null;

    /**
     * Only the actual agent photo receives ImageObject schema.
     *
     * Ajur's default social image is not described as the person's image.
     */
    const profileImageSchema =
      agentProfileImage
        ? {
            "@type":
              "ImageObject",
            "@id": profileImageId,
            url: agentProfileImage,
            contentUrl:
              agentProfileImage,
            name: agentImageAlt,
            caption: agentImageAlt,
            inLanguage: "fa-IR",
            representativeOfPage:
              true,

            about: {
              "@id": personId,
            },
          }
        : null;

    const itemListSchema = {
      "@type": "ItemList",
      "@id": listingsId,

      name: cityName
        ? `فایل‌های ملکی ${agentName} در ${cityName}`
        : `فایل‌های ملکی ${agentName}`,

      numberOfItems:
        itemListElements.length,

      itemListOrder:
        "https://schema.org/ItemListOrderAscending",

      itemListElement:
        itemListElements,

      about: {
        "@id": personId,
      },
    };

    const breadcrumbSchema = {
      "@type":
        "BreadcrumbList",
      "@id": breadcrumbId,

      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "آجر",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "مشاورین املاک",
          item:
            `${SITE_URL}/agents`,
        },

        ...(cityName
          ? [
              {
                "@type":
                  "ListItem",
                position: 3,
                name:
                  `مشاورین املاک ${cityName}`,

                /**
                 * If city.slug is unavailable, no false URL is guessed.
                 */
                ...(realstate?.city
                  ?.slug
                  ? {
                      item:
                        `${SITE_URL}/agents/${encodeURIComponent(
                          realstate
                            .city
                            .slug
                        )}`,
                    }
                  : {}),
              },
              {
                "@type":
                  "ListItem",
                position: 4,
                name: pageHeading,
                item: canonical,
              },
            ]
          : [
              {
                "@type":
                  "ListItem",
                position: 3,
                name: pageHeading,
                item: canonical,
              },
            ]),
      ],
    };

    return {
      "@context":
        "https://schema.org",

      "@graph": [
        {
          "@type": "WebSite",
          "@id":
            `${SITE_URL}/#website`,
          url: SITE_URL,
          name: "آجر",
          inLanguage: "fa-IR",
        },

        profilePageSchema,
        personSchema,

        ...(agencySchema
          ? [agencySchema]
          : []),

        ...(profileImageSchema
          ? [profileImageSchema]
          : []),

        itemListSchema,
        breadcrumbSchema,
      ],
    };
  }, [
    address,
    agentImageAlt,
    agentName,
    agentProfileImage,
    agencyName,
    allWorkers,
    canonical,
    cityName,
    neighborhoodName,
    pageAvailable,
    pageHeading,
    phone,
    realstate,
    seoData.description,
    seoData.title,
  ]);

  /**
   * Replacing "<" prevents API data from breaking out of JSON-LD.
   */
  const serializedJsonLd =
    useMemo(() => {
      if (!jsonLd) {
        return "";
      }

      return JSON.stringify(
        jsonLd
      ).replace(
        /</g,
        "\\u003c"
      );
    }, [jsonLd]);

  const renderRealstate = () => {
    if (realstate?.id) {
      return (
        <RealstateCard
          realstate={realstate}
          slug={
            realstate?.slug ||
            pageId
          }
          agentName={agentName}
          agencyName={agencyName}
          imageAlt={agentImageAlt}
        />
      );
    }

    return <RealstateSkeleton />;
  };

  const renderWorkers = () => {
    if (
      filteredWorkers.length === 0
    ) {
      return (
        <Grid
          item
          md={12}
          xs={12}
        >
          <p
            style={{
              textAlign: "center",
              width: "100%",
            }}
          >
            متأسفانه موردی یافت نشد
          </p>
        </Grid>
      );
    }

    return (
      <LazyLoader
        items={filteredWorkers}
        itemsPerPage={
          WORKERS_PER_PAGE
        }
        renderItem={(worker) => {
          const workerPath =
            worker?.id
              ? `/worker/${encodeURIComponent(
                  String(worker.id)
                )}`
              : "#";

          return (
            <Grid
              item
              md={4}
              xs={12}
              key={
                worker?.id ||
                worker?.slug
              }
            >
              <Link
                href={workerPath}
                legacyBehavior
              >
                <a
                  aria-label={`مشاهده ${getWorkerName(
                    worker
                  )}`}
                >
                  <WorkerCard
                    worker={worker}
                  />
                </a>
              </Link>
            </Grid>
          );
        }}
        loadingComponent={
          <p
            style={{
              textAlign:
                "center",
            }}
          >
            در حال بارگذاری...
          </p>
        }
        endComponent={
          <p
            style={{
              textAlign:
                "center",
            }}
          >
            همه فایل‌ها بارگذاری
            شدند ✅
          </p>
        }
        grid
        gridProps={{
          spacing: 2,
        }}
        itemProps={{
          xl: 3,
          md: 4,
          xs: 12,
        }}
      />
    );
  };

  const renderFilteringHeader =
    () => {
      if (!showFiltersStatus) {
        return null;
      }

      return (
        <div
          className={
            Styles[
              "header-wrapper"
            ]
          }
        >
          <Box
            sx={{
              flexGrow: 0,
            }}
          />
        </div>
      );
    };

  const renderSelectedFilters =
    () => {
      if (
        !selectedCategoryId
      ) {
        return null;
      }

      const selectedFields =
        normalFields.filter(
          (field) =>
            Number(
              field?.special
            ) === 1 &&
            (toNumber(
              field?.low,
              0
            ) > 0 ||
              toNumber(
                field?.high,
                0
              ) > 0)
        );

      if (
        selectedFields.length === 0
      ) {
        return null;
      }

      return (
        <div>
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            <Grid
              container
              spacing={2}
            >
              {selectedFields.map(
                (field) => (
                  <Grid
                    item
                    key={field.id}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={
                        <DeleteIcon />
                      }
                      onClick={() =>
                        deleteFieldFilter(
                          field.id
                        )
                      }
                    >
                      {field.value}
                    </Button>
                  </Grid>
                )
              )}
            </Grid>
          </Box>
        </div>
      );
    };

  const renderFiltersButton =
    () => {
      if (
        !selectedCategoryId ||
        selectedCategoryId ===
          "all"
      ) {
        return null;
      }

      return (
        <div
          className={
            Styles[
              "neighborhood-icon-wrapper"
            ]
          }
        >
          <Button
            onClick={
              openFiltersSelection
            }
            endIcon={<TuneIcon />}
            variant="text"
            size="medium"
            fullWidth
            style={{
              backgroundColor:
                "white",
              margin: 10,
            }}
          >
            <div>
              فیلترهای بیشتر
              {activeFiltersCount >
              0
                ? ` (${activeFiltersCount})`
                : ""}
            </div>
          </Button>
        </div>
      );
    };

  const renderCategoryButtons =
    () => {
      if (
        categories.length === 0
      ) {
        return null;
      }

      return (
        <Container
          maxWidth="lg"
          sx={{
            mt: 3,
            mb: 1,
            paddingTop: 2,
            textAlign:
              "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              paddingBottom: 1,
              direction: "rtl",
            }}
          >
            <Button
              variant={
                !selectedCategoryId ||
                selectedCategoryId ===
                  "all"
                  ? "contained"
                  : "outlined"
              }
              onClick={() =>
                handleCategorySelect(
                  "all"
                )
              }
              sx={{
                whiteSpace:
                  "nowrap",
              }}
            >
              همه فایل‌ها
            </Button>

            {categories.map(
              (category) => (
                <Button
                  key={
                    category.id
                  }
                  variant={
                    String(
                      selectedCategoryId
                    ) ===
                    String(
                      category.id
                    )
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    handleCategorySelect(
                      category
                    )
                  }
                  sx={{
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {category.name ||
                    category.title}
                </Button>
              )
            )}
          </Box>

          {renderFiltersButton()}
        </Container>
      );
    };

  const renderModalTitle =
    () => {
      if (
        modalType !== "filters"
      ) {
        return null;
      }

      return (
        <p
          id="filters-modal-title"
          className={
            Styles[
              "modal-header-title"
            ]
          }
        >
          فیلترهای{" "}
          {selectedCategoryName} (
          {filteredWorkers.length} فایل
          موجود)
        </p>
      );
    };

  const renderFieldsFilters =
    () => {
      if (
        loadingCategoryFields
      ) {
        return (
          <SpinnerModalLoader />
        );
      }

      const specialFields =
        normalFields.filter(
          (field) =>
            Number(
              field?.special
            ) === 1
        );

      if (
        specialFields.length === 0
      ) {
        return (
          <p
            id="filters-modal-description"
            style={{
              textAlign:
                "center",
              padding: 20,
            }}
          >
            فیلتری برای این دسته‌بندی
            موجود نیست.
          </p>
        );
      }

      return specialFields.map(
        (field) => {
          const minimum =
            toNumber(
              field.min_range,
              0
            );

          const maximum =
            toNumber(
              field.max_range,
              minimum
            );

          const low =
            toNumber(
              field.low,
              0
            ) > 0
              ? toNumber(
                  field.low
                )
              : minimum;

          const high =
            toNumber(
              field.high,
              0
            ) > 0
              ? toNumber(
                  field.high
                )
              : maximum;

          const filterIsActive =
            toNumber(
              field.low,
              0
            ) > 0 ||
            toNumber(
              field.high,
              0
            ) > 0;

          return (
            <div key={field.id}>
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon />
                  }
                  aria-controls={`filter-${field.id}-content`}
                  id={`filter-${field.id}-header`}
                >
                  {filterIsActive && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={
                        <CancelIcon />
                      }
                      onClick={(
                        event
                      ) => {
                        event.stopPropagation();

                        deleteFieldFilter(
                          field.id
                        );
                      }}
                    >
                      حذف
                    </Button>
                  )}

                  <p
                    style={{
                      direction:
                        "rtl",
                      textAlign:
                        "right",
                      marginRight:
                        10,
                      color: "gray",
                      fontSize: 14,
                      padding: 10,
                      marginLeft: 10,
                      width: "100%",
                    }}
                  >
                    {field.value}
                  </p>
                </AccordionSummary>

                <AccordionDetails>
                  <div
                    id={`filter-${field.id}-content`}
                    style={{
                      padding:
                        "20px 50px",
                    }}
                  >
                    <Slider
                      getAriaLabel={() =>
                        `محدوده ${field.value}`
                      }
                      value={[
                        low,
                        high,
                      ]}
                      onChange={(
                        event,
                        newValue
                      ) =>
                        handleSliderChange(
                          field.id,
                          newValue
                        )
                      }
                      valueLabelFormat={
                        numberFormatter
                      }
                      valueLabelDisplay="on"
                      min={minimum}
                      max={maximum}
                      disableSwap
                    />
                  </div>
                </AccordionDetails>
              </Accordion>

              <Divider
                sx={{
                  borderBottomWidth:
                    2,
                  background:
                    "#555",
                  margin: 3,
                }}
                fullWidth
              />
            </div>
          );
        }
      );
    };

  const renderModalContent =
    () => {
      if (loading) {
        return (
          <SpinnerModalLoader />
        );
      }

      if (
        modalType !== "filters"
      ) {
        return null;
      }

      return (
        <div
          style={{
            padding: 10,
          }}
        >
          <div
            className={
              Styles[
                "modal-header"
              ]
            }
          >
            <Box
              sx={{
                flexGrow: 1,
              }}
            >
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  md={2}
                  xs={2}
                >
                  <Button
                    onClick={
                      closeModal
                    }
                    variant="text"
                    aria-label="بستن پنجره فیلترها"
                  >
                    <CloseIcon
                      className={
                        Styles[
                          "modal-header-close-button"
                        ]
                      }
                    />
                  </Button>
                </Grid>

                <Grid
                  item
                  md={10}
                  xs={10}
                >
                  {renderModalTitle()}
                </Grid>
              </Grid>
            </Box>
          </div>

          {renderFieldsFilters()}

          <div
            className={
              Styles[
                "neighborhood-modal-footer-wrapper"
              ]
            }
          >
            <Button
              size="large"
              variant="text"
              style={{
                fontSize: 13,
                paddingRight: 20,
                background:
                  "white",
                border:
                  "1px solid black",
                marginRight: 10,
                textAlign:
                  "center",
              }}
              onClick={
                resetFieldsFilterForm
              }
            >
              حذف فیلترها
            </Button>

            <Button
              size="large"
              variant="contained"
              style={{
                fontSize: 15,
                width: 200,
              }}
              onClick={
                confirmFilteringFields
              }
            >
              تأیید
            </Button>
          </div>
        </div>
      );
    };

  const renderModal = () => (
    <Modal
      open={openModal}
      onClose={closeModal}
      aria-labelledby="filters-modal-title"
      aria-describedby="filters-modal-description"
    >
      <Box
        className={
          Styles[
            "modal-wrapper"
          ]
        }
      >
        {renderModalContent()}
      </Box>
    </Modal>
  );

  const renderContent = () => {
    if (initialServerError) {
      return (
        <main
          className="spinnerImageView"
          dir="rtl"
        >
          <div
            style={{
              padding: 40,
              textAlign: "center",
            }}
          >
            <p>
              در حال حاضر دریافت
              اطلاعات این مشاور املاک
              امکان‌پذیر نیست.
            </p>

            <Button
              variant="contained"
              onClick={() =>
                window.location.reload()
              }
            >
              تلاش دوباره
            </Button>
          </div>
        </main>
      );
    }

    if (!realstate) {
      return (
        <div className="spinnerImageView">
          <img
            className="spinner-image"
            src="/logo/ajour-gif.gif"
            alt="در حال بارگذاری آجر"
            width="80"
            height="80"
          />
        </div>
      );
    }

    return (
      <main dir="rtl">
        <article
          itemScope
          itemType="https://schema.org/ProfilePage"
        >
          <div
            className={
              Styles[
                "realstate-items-wrapper"
              ]
            }
          >
            {/*
              This header is part of the initial server-rendered HTML.

              Keep only one H1 on the page. If RealstateCard currently
              renders another H1, change that internal heading to H2/div.
            */}
            <header
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: 16,
                textAlign:
                  "right",
                maxWidth: 1200,
                margin:
                  "20px auto 10px",
                padding:
                  "0 16px",
              }}
            >
              {/*
                The actual agent photo is rendered as a normal <img>,
                making it directly discoverable by search engines.

                If RealstateCard displays the same image, you may remove
                the duplicate image from RealstateCard.
              */}
              {agentProfileImage && (
                <img
                  src={
                    agentProfileImage
                  }
                  alt={agentImageAlt}
                  title={
                    agentImageAlt
                  }
                  width="112"
                  height="112"
                  loading="eager"
                  decoding="async"
                  itemProp="image"
                  style={{
                    width: 112,
                    height: 112,
                    flexShrink: 0,
                    objectFit:
                      "cover",
                    borderRadius:
                      "50%",
                    border:
                      "1px solid #e5e5e5",
                    backgroundColor:
                      "#f7f7f7",
                  }}
                />
              )}

              <div>
                <h1
                  itemProp="headline"
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    margin:
                      "0 0 8px",
                    lineHeight: 1.8,
                  }}
                >
                  {pageHeading}
                </h1>

                <p
                  style={{
                    color: "#666",
                    fontSize: 14,
                    lineHeight: 2,
                    margin: 0,
                  }}
                >
                  {agencyName &&
                  cityName
                    ? `اطلاعات تماس، معرفی و فایل‌های ملکی ${agentName}، مشاور فعال در ${agencyName} در ${cityName}`
                    : agencyName
                      ? `اطلاعات تماس، معرفی و فایل‌های ملکی ${agentName}، مشاور فعال در ${agencyName}`
                      : cityName
                        ? `اطلاعات تماس، معرفی و فایل‌های ملکی ${agentName} در ${cityName}`
                        : `اطلاعات تماس، معرفی و فایل‌های ملکی ${agentName}`}
                </p>
              </div>
            </header>

            <div>
              <Box
                sx={{
                  flexGrow: 1,
                }}
              >
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    md={2}
                    xs={0}
                  />

                  <Grid
                    item
                    md={8}
                    xs={12}
                  >
                    {renderRealstate()}
                  </Grid>

                  <Grid
                    item
                    md={2}
                    xs={0}
                  />
                </Grid>
              </Box>
            </div>

            <div
              className={
                Styles[
                  "contact-wrapper"
                ]
              }
            >
              <Box
                component="div"
                sx={{
                  p: 2,
                  border:
                    "1px dashed grey",
                  margin: "5px",
                  textAlign:
                    "center",
                }}
              >
                <Grid
                  container
                  spacing={1}
                >
                  <Grid
                    item
                    xs={6}
                    md={6}
                  >
                    <Button
                      fullWidth
                      className={
                        Styles[
                          "worker-detail-button"
                        ]
                      }
                      variant="contained"
                      startIcon={
                        <TourOutlinedIcon />
                      }
                    >
                      درخواست فایل
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={6}
                  >
                    <Button
                      fullWidth
                      disabled={!phone}
                      onClick={() =>
                        handleCall(
                          realstate.id,
                          phone
                        )
                      }
                      className={
                        Styles[
                          "worker-detail-button"
                        ]
                      }
                      variant="outlined"
                      startIcon={
                        <CallIcon />
                      }
                      aria-label={
                        phone
                          ? `تماس با ${agentName}`
                          : "شماره تماس موجود نیست"
                      }
                    >
                      {phone ||
                        "شماره تماس"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </div>

            {renderCategoryButtons()}
            {renderFilteringHeader()}
            {renderSelectedFilters()}

            <section
              aria-labelledby="agent-properties-title"
              style={{
                maxWidth: 1200,
                margin:
                  "20px auto",
                padding:
                  "0 16px",
              }}
            >
              <h2
                id="agent-properties-title"
                style={{
                  textAlign:
                    "right",
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 20,
                }}
              >
                {cityName
                  ? `فایل‌های ملکی ${agentName} در ${cityName}`
                  : `فایل‌های ملکی ${agentName}`}
              </h2>

              <div
                style={{
                  display: "flex",
                }}
              >
                {renderWorkers()}
              </div>
            </section>
          </div>
        </article>
      </main>
    );
  };

  return (
    <div className="realstate-contents-wrapper">
      <Head>
        <title>
          {seoData.title}
        </title>

        <meta
          name="description"
          content={
            seoData.description
          }
        />

        <meta
          name="robots"
          content={robotsContent}
        />

        <link
          rel="canonical"
          href={seoData.canonical}
        />

        <meta
          property="og:locale"
          content="fa_IR"
        />

        <meta
          property="og:type"
          content="profile"
        />

        <meta
          property="og:site_name"
          content="آجر"
        />

        <meta
          property="og:title"
          content={seoData.title}
        />

        <meta
          property="og:description"
          content={
            seoData.description
          }
        />

        <meta
          property="og:url"
          content={
            seoData.canonical
          }
        />

        <meta
          property="og:image"
          content={seoData.image}
        />

        <meta
          property="og:image:secure_url"
          content={seoData.image}
        />

        <meta
          property="og:image:alt"
          content={
            seoData.imageAlt
          }
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content={seoData.title}
        />

        <meta
          name="twitter:description"
          content={
            seoData.description
          }
        />

        <meta
          name="twitter:image"
          content={seoData.image}
        />

        <meta
          name="twitter:image:alt"
          content={
            seoData.imageAlt
          }
        />

        {serializedJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                serializedJsonLd,
            }}
          />
        )}
      </Head>

      {renderContent()}
      {renderModal()}
    </div>
  );
};

/**
 * Force clean component state when navigating between agent pages.
 */
const RealestateSinglePage = (
  props
) => (
  <RealestateSingle
    key={props.pageId}
    {...props}
  />
);

export default RealestateSinglePage;

export async function getServerSideProps(
  context
) {
  const rawId =
    context.params?.id;

  const pageId =
    Array.isArray(rawId)
      ? rawId[0]
      : rawId;

  if (
    typeof pageId !== "string" ||
    !pageId.trim()
  ) {
    return {
      notFound: true,
    };
  }

  const normalizedPageId =
    pageId.trim();

  /**
   * Use the requested path for canonical but remove:
   * - query parameters
   * - URL fragments
   * - trailing slashes
   */
  const rawResolvedUrl =
    context.resolvedUrl || "";

  const canonicalPath =
    rawResolvedUrl
      .split("?")[0]
      .split("#")[0]
      .replace(/\/+$/, "") ||
    "/";

  /**
   * Avoid serving stale agent information.
   */
  context.res.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate"
  );

  try {
    const response =
      await axios.get(API_URL, {
        params: {
          realstate_id:
            normalizedPageId,
        },
        timeout:
          REQUEST_TIMEOUT,
        headers: {
          Accept:
            "application/json",
        },
      });

    const realstate =
      response.data?.realstate ||
      null;

    const workers =
      Array.isArray(
        response.data?.workers
      )
        ? response.data.workers
        : [];

    const subcategories =
      Array.isArray(
        response.data
          ?.subcategories
      )
        ? response.data
            .subcategories
        : [];

    /**
     * Missing agent data must result in a real 404.
     */
    if (!realstate?.id) {
      return {
        notFound: true,
      };
    }

    /**
     * A profile without a personal name should not become an
     * indexable agency-only page accidentally.
     */
    const serverAgentName =
      getAgentName(realstate);

    if (!serverAgentName) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        pageId:
          normalizedPageId,
        canonicalPath,

        initialRealstate:
          makeSerializable(
            realstate,
            null
          ),

        initialWorkers:
          makeSerializable(
            workers,
            []
          ),

        initialSubcategories:
          makeSerializable(
            subcategories,
            []
          ),

        initialServerError:
          false,
      },
    };
  } catch (error) {
    const status =
      error?.response?.status;

    /**
     * API 404 means the agent does not exist.
     */
    if (status === 404) {
      return {
        notFound: true,
      };
    }

    console.error(
      `Single-agent SSR request failed for "${normalizedPageId}":`,
      error?.message || error
    );

    /**
     * Temporary API failures receive HTTP 503 so Google retries later.
     */
    context.res.statusCode = 503;

    context.res.setHeader(
      "Retry-After",
      "300"
    );

    return {
      props: {
        pageId:
          normalizedPageId,
        canonicalPath,
        initialRealstate:
          null,
        initialWorkers: [],
        initialSubcategories:
          [],
        initialServerError:
          true,
      },
    };
  }
}
