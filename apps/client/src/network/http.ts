import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

type AxiosRetryError = AxiosError & {config: {__isRetry?: boolean}};
type OnErrorCallback = (axiosInstance: AxiosInstance) => (error: AxiosRetryError) => void;

const defaultConfig: AxiosRequestConfig = {
  baseURL: process?.env?.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};
const formConfig: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

export abstract class Http {
  public baseURL: string;
  protected prefix = '';
  protected axiosInstance: AxiosInstance;
  protected onErrorId: number | null = null;

  protected static instances: {[key: string]: Http} = {};
  protected static token: string | null = null;
  protected static locale: string | null = null;
  protected static onError?: OnErrorCallback;
  public static ingressBaseURL = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';

  constructor(overrideConfig: AxiosRequestConfig = {}) {
    const config: AxiosRequestConfig = Object.assign({}, defaultConfig, overrideConfig);
    this.baseURL = config.baseURL as string;
    this.axiosInstance = axios.create(config);

    if (!Http.instances[this.baseURL]) {
      if (Http.token) {
        this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${Http.token}`;
      }
      if (Http.locale) {
        this.axiosInstance.defaults.headers.common['X-Locale'] = Http.locale;
      }
      if (Http.onError && !this.onErrorId) {
        this.onErrorId = this.axiosInstance.interceptors.response.use(
          config => config, Http.onError,
        );
      }
      Http.instances[this.baseURL] = this;
    }
  }

  static setToken(token: string | null) {
    Http.token = token;
    Object.keys(Http.instances).forEach(key => {
      Http.instances[key].axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    });
  }

  static unsetToken() {
    Http.token = null;
    Object.keys(Http.instances).forEach(key => {
      delete Http.instances[key].axiosInstance.defaults.headers.common.Authorization;
    });
  }

  static setLocale(locale: string) {
    Http.locale = locale;
    Object.keys(Http.instances).forEach(key => {
      Http.instances[key].axiosInstance.defaults.headers.common['X-Locale'] = locale;
    });
  }

  static setOnError(onError: OnErrorCallback) {
    Http.onError = onError;
    Object.keys(Http.instances).forEach(key => {
      const http = Http.instances[key];
      if (http.onErrorId !== null) {
        http.axiosInstance.interceptors.response.eject(http.onErrorId);
      }
      const errorHandler = onError(http.axiosInstance);
      http.onErrorId = http.axiosInstance.interceptors.response.use(
        config => config, errorHandler,
      );
    });
  }

  get<T = null>(path = '', config?: AxiosRequestConfig) {
    return this.client.get<T>(this.prefix + path, config);
  }

  post<T = null>(path = '', payload: any = undefined, config?: AxiosRequestConfig) {
    return this.client.post<T>(this.prefix + path, payload, config);
  }

  postFormData<T = null>(path: string, payload: any = undefined, config?: AxiosRequestConfig) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value as any);
    }

    return this.client.post<T>(
      this.prefix + path,
      formData,
      config ? { ...formConfig, ...config } : formConfig,
    );
  }

  patch<T = null>(path = '', payload: any = undefined, config?: AxiosRequestConfig) {
    return this.client.patch<T>(this.prefix + path, payload, config);
  }

  put<T = null>(path = '', payload: any = undefined, config?: AxiosRequestConfig) {
    return this.client.put<T>(this.prefix + path, payload, config);
  }

  delete<T = null>(path = '') {
    return this.client.delete<T>(this.prefix + path);
  }

  get client(): AxiosInstance {
    return Http.instances[this.baseURL].axiosInstance;
  }
}

// SOMEWERE AT APP BOOTSTRAP
// const token = localStorage.getItem('jwt');
// token ? Http.setToken(token) : Http.unsetToken();
// Http.setOnError(axiosInstance => async (error) => {
//   if (error.response?.status === 401 && error.config && !error.config.__isRetry) {
//     error.config.__isRetry = true;
//     try {
//       const { accessToken } = await authHttp.refresh();
//       localStorage.setItem('jwt', accessToken);
//       Http.setToken(accessToken);
//       error.config.headers.Authorization = `Bearer ${accessToken}`;
//       return axiosInstance.request(error.config);
//     } catch (refreshError) {
//        if (refreshError.response?.status === 401) {
//          Http.unsetToken();
//          localStorage.deleteItem('jwt');
//        } else {
//          console.error(refreshError);
//        }
//      }
//   }
//   throw error;
// });
