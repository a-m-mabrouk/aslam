import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_EXAMS } from "../../router/routes/apiRoutes";
import axiosDefault from "../../utilities/axios";
import { toastifyBox } from "../../helper/toastifyBox";

interface DomainState {
  domains: DomainType[];
  loading: boolean;
  error: null | string;
}
interface FetchDomainPayload {
  success: boolean;
  errors: boolean;
  message: string;
  data: DomainType[];
}

interface AddDomainPayload {
  success: boolean;
  errors: boolean;
  message: string;
  data: {
    course_id: number;
    id: number;
    name: {
      ar: string;
      en: string;
    };
  };
}
interface AddSubdomainPayload {
  success: boolean;
  errors: boolean;
  message: string;
  data: {
    domain_id: number;
    id: number;
    name: {
      ar: string;
      en: string;
    };
  };
}
interface AddAssessmentPayload {
  success: boolean;
  errors: boolean;
  message: string;
  data: {
    course_id: number;
    module_id: null;
    domain_id: number | null;
    subdomain_id: number | null;
    id: number;
    name: {
      ar: string;
      en: string;
    };
  };
}
interface DeleteAssessmentPayload {
  success: boolean;
  errors: boolean;
  message: string;
  assessmentId: number;
  data: {
    course_id: number;
    module_id: null;
    domain_id: number | null;
    subdomain_id: number | null;
    id: number;
    name: {
      ar: string;
      en: string;
    };
  };
}

const initialState: DomainState = {
  domains: [],
  loading: false,
  error: null,
};

// Async thunk for fetching students
export const fetchDomains = createAsyncThunk(
  "domains/fetchDomains",
  async (course_id: number) => {
    const response = await axiosDefault.get(API_EXAMS.domains, {
      params: { course_id },
    });
    return response.data;
  },
);
export const addDomain = createAsyncThunk(
  "domains/addDomain",
  async (domainData: unknown) => {
    const response = await axiosDefault.post(API_EXAMS.domains, domainData);
    return response.data;
  },
);
export const addSubdomain = createAsyncThunk(
  "domains/addSubdomain",
  async (subdomainData: unknown) => {
    const response = await axiosDefault.post(
      API_EXAMS.subdomain,
      subdomainData,
    );
    return response.data;
  },
);
export const addAssessment = createAsyncThunk(
  "domains/addAssessment",
  async (assessmentData: unknown) => {
    const response = await axiosDefault.post(
      API_EXAMS.assessments,
      assessmentData,
    );
    return response.data;
  },
);
export const editDomain = createAsyncThunk(
  "domains/editDomain",
  async ({
    id,
    course_id,
    name_en,
    name_ar,
  }: {
    id: number;
    course_id: number;
    name_en: string;
    name_ar: string;
  }) => {
    const response = await axiosDefault.post(`${API_EXAMS.domains}/${id}`, {
      course_id,
      name_en,
      name_ar,
      _method: "put",
    });
    return response.data;
  },
);
export const editSubdomain = createAsyncThunk(
  "domains/editSubdomain",
  async ({
    id,
    course_id,
    name_en,
    name_ar,
  }: {
    id: number;
    course_id: number;
    name_en: string;
    name_ar: string;
  }) => {
    const response = await axiosDefault.post(`${API_EXAMS.subdomain}/${id}`, {
      course_id,
      name_en,
      name_ar,
      _method: "put",
    });
    return response.data;
  },
);
export const editAssessment = createAsyncThunk(
  "domains/editAssessment",
  async ({
    id,
    course_id,
    name_en,
    name_ar,
  }: {
    id: number;
    course_id: number;
    name_en: string;
    name_ar: string;
  }) => {
    const response = await axiosDefault.post(`${API_EXAMS.assessments}/${id}`, {
      course_id,
      name_en,
      name_ar,
      _method: "put",
    });
    return response.data;
  },
);
export const deleteDomain = createAsyncThunk(
  "domains/deleteDomain",
  async (domainId: unknown) => {
    const response = await axiosDefault.delete(
      `${API_EXAMS.domains}/${domainId}`,
    );
    return { ...response.data, id: domainId };
  },
);
export const deleteSubdomain = createAsyncThunk(
  "domains/deleteSubdomain",
  async (subdomainId: unknown) => {
    const response = await axiosDefault.delete(
      `${API_EXAMS.subdomain}/${subdomainId}`,
    );
    return { ...response.data, id: subdomainId };
  },
);
export const deleteAssessment = createAsyncThunk(
  "domains/deleteAssessment",
  async (assessmentId: unknown) => {
    const response = await axiosDefault.delete(
      `${API_EXAMS.assessments}/${assessmentId}`,
    );
    return { ...response.data, assessmentId };
  },
);

// Create examsDomains slice
const examsDomains = createSlice({
  name: "examsDomains",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDomains.pending, (state) => {
        state.loading = true;
        state.domains = [];
        state.error = null;
      })
      .addCase(
        fetchDomains.fulfilled,
        (state, action: PayloadAction<FetchDomainPayload>) => {
          state.domains = action.payload.data;
          state.loading = false;
        },
      )
      .addCase(fetchDomains.rejected, (state, action) => {
        state.domains = [];
        state.error = action.error.message || "Failed to fetch students";
        state.loading = false;
      })
      .addCase(addDomain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addDomain.fulfilled,
        (state, action: PayloadAction<AddDomainPayload>) => {
          const { data, message } = action.payload;
          const domain = {
            id: data.id,
            course_id: +data.course_id,
            name: data.name,
            subdomains: [],
            assessments: [],
          };
          state.domains.push(domain);
          state.loading = false;
          toastifyBox("success", message);
        },
      )
      .addCase(addDomain.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch students";
        state.loading = false;
      })
      .addCase(addSubdomain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addSubdomain.fulfilled,
        (state, action: PayloadAction<AddSubdomainPayload>) => {
          const { data, message } = action.payload;
          const subdomain = {
            id: data.id,
            domain_id: +data.domain_id,
            name: data.name,
            assessments: [],
          };
          state.domains.forEach((domain) => {
            if (domain.id === subdomain.domain_id) {
              domain.subdomains?.push({
                ...subdomain,
                course_id: domain.course_id,
              });
            }
          });
          state.loading = false;
          toastifyBox("success", message);
        },
      )
      .addCase(addSubdomain.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch students";
        state.loading = false;
      })
      .addCase(addAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addAssessment.fulfilled,
        (state, action: PayloadAction<AddAssessmentPayload>) => {
          const { data, message } = action.payload;
          const assessment = {
            id: data.id,
            course_id: +data.course_id,
            domain_id: data.domain_id ? +data.domain_id : null,
            subdomain_id: data.subdomain_id ? +data.subdomain_id : null,
            name: data.name,
          };
          if (assessment.domain_id) {
            state.domains.forEach((domain) => {
              if (domain.id === assessment.domain_id) {
                domain.assessments.push({
                  ...assessment,
                  module_id: null,
                  questions: [],
                });
              }
            });
          }
          if (assessment.subdomain_id) {
            state.domains.forEach((domain) => {
              domain.subdomains?.forEach((subdomain) => {
                if (subdomain.id === assessment.subdomain_id) {
                  subdomain.assessments.push({
                    ...assessment,
                    module_id: null,
                    questions: [],
                  });
                }
              });
            });
          }
          state.loading = false;
          toastifyBox("success", message);
        },
      )
      .addCase(addAssessment.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch students";
        state.loading = false;
      })
      .addCase(deleteDomain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteDomain.fulfilled,
        (
          state,
          action: PayloadAction<{
            id: number;
            success: boolean;
            errors: boolean;
            message: string;
          }>,
        ) => {
          const { message, id } = action.payload;
          state.domains = state.domains.filter((domain) => domain.id !== id);
          state.loading = false;
          toastifyBox("success", message);
        },
      )
      .addCase(deleteDomain.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch students";
        state.loading = false;
      })
      .addCase(deleteSubdomain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteSubdomain.fulfilled,
        (
          state,
          action: PayloadAction<{
            id: number;
            success: boolean;
            errors: boolean;
            message: string;
          }>,
        ) => {
          const { id, message } = action.payload;
          state.domains = state.domains.map((domain) => ({
            ...domain,
            subdomains: domain.subdomains?.filter(
              (subdomain) => subdomain.id !== id,
            ),
          }));
          state.loading = false;
          toastifyBox("success", message);
        },
      )
      .addCase(deleteSubdomain.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch students";
        state.loading = false;
      })
      .addCase(deleteAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteAssessment.fulfilled,
        (state, action: PayloadAction<DeleteAssessmentPayload>) => {
          const { assessmentId, message } = action.payload;

          state.domains = state.domains.map((domain) => {
            if (
              domain.assessments.some(
                (assessment) => assessment.id === assessmentId,
              )
            ) {
              return {
                ...domain,
                assessments: domain.assessments.filter(
                  (assessment) => assessment.id !== assessmentId,
                ),
              };
            }

            if (domain.subdomains) {
              const updatedSubdomains = domain.subdomains.map((subdomain) => {
                if (
                  subdomain.assessments.some(
                    (assessment) => assessment.id === assessmentId,
                  )
                )
                  ({
                    ...subdomain,
                    assessments: subdomain.assessments.filter(
                      (assessment) => assessment.id !== assessmentId,
                    ),
                  });
                return subdomain;
              });
              return { ...domain, subdomains: updatedSubdomains };
            }

            return domain;
          });
          state.loading = false;
          toastifyBox("success", message);
        },
      )
      .addCase(deleteAssessment.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch students";
        state.loading = false;
      });
  },
});

export default examsDomains.reducer;
