/**
 * HTTP 请求服务
 * 提供带重试机制、超时控制的通用 HTTP 请求方法
 */

/**
 * HTTP 请求配置选项
 */
export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number; // 超时时间（毫秒）
  maxRetries?: number; // 最大重试次数
  retryDelay?: number; // 重试延迟（毫秒）
  enableLog?: boolean; // 是否启用日志
}

/**
 * HTTP 请求响应
 */
export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

// 默认配置
const DEFAULT_CONFIG = {
  timeout: 60000, // 60秒超时
  maxRetries: 3, // 最大重试3次
  retryDelay: 1000, // 重试延迟1秒
  enableLog: true // 启用日志
};

/**
 * 延迟函数
 * @param ms 延迟毫秒数
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 通用 HTTP 请求函数（带重试和超时控制）
 * @param url 请求地址
 * @param options 请求选项
 * @returns Promise<HttpResponse>
 *
 * @example
 * // 基础用法
 * const response = await httpRequest('https://api.example.com/data', {
 *   method: 'GET'
 * });
 *
 * // POST 请求
 * const response = await httpRequest('https://api.example.com/create', {
 *   method: 'POST',
 *   body: { name: 'test' },
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 *
 * // 自定义重试和超时
 * const response = await httpRequest('https://api.example.com/data', {
 *   timeout: 30000,
 *   maxRetries: 5,
 *   retryDelay: 2000
 * });
 */
export const httpRequest = async <T = any>(
  url: string,
  options: HttpRequestOptions = {}
): Promise<HttpResponse<T>> => {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = DEFAULT_CONFIG.timeout,
    maxRetries = DEFAULT_CONFIG.maxRetries,
    retryDelay = DEFAULT_CONFIG.retryDelay,
    enableLog = DEFAULT_CONFIG.enableLog
  } = options;

  const log = enableLog
    ? {
        info: (message: string, ...args: any[]) => console.log(`[HttpService]`, message, ...args),
        error: (message: string, ...args: any[]) => console.error(`[HttpService]`, message, ...args),
        warn: (message: string, ...args: any[]) => console.warn(`[HttpService]`, message, ...args)
      }
    : {
        info: () => {},
        error: () => {},
        warn: () => {}
      };

  /**
   * 执行单次请求
   */
  const doRequest = async (): Promise<HttpResponse<T>> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        signal: controller.signal
      };

      if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`请求超时 (${timeout}ms)`);
      }

      throw error;
    }
  };

  /**
   * 带重试机制的请求执行
   */
  const requestWithRetry = async (retryCount: number = 0): Promise<HttpResponse<T>> => {
    try {
      log.info(`请求 ${method} ${url} (第${retryCount + 1}次尝试)`);
      const result = await doRequest();
      log.info(`请求成功，状态: ${result.status}`);
      return result;
    } catch (error: any) {
      log.error(`请求失败: ${error.message}`);

      // 如果还有重试次数，则延迟后重试
      if (retryCount < maxRetries - 1) {
        log.warn(`${retryDelay}ms 后进行第 ${retryCount + 2} 次重试...`);
        await sleep(retryDelay);
        return requestWithRetry(retryCount + 1);
      }

      // 重试次数用完，抛出最终错误
      log.error(`已达到最大重试次数 (${maxRetries}次)，放弃重试`);
      throw new Error(`请求失败，已重试${maxRetries}次: ${error.message}`);
    }
  };

  return requestWithRetry();
};

/**
 * GET 请求
 */
export const get = <T = any>(
  url: string,
  options: Omit<HttpRequestOptions, 'method'> = {}
): Promise<HttpResponse<T>> => {
  return httpRequest<T>(url, { ...options, method: 'GET' });
};

/**
 * POST 请求
 */
export const post = <T = any>(
  url: string,
  body: any,
  options: Omit<HttpRequestOptions, 'method' | 'body'> = {}
): Promise<HttpResponse<T>> => {
  return httpRequest<T>(url, { ...options, method: 'POST', body });
};

/**
 * PUT 请求
 */
export const put = <T = any>(
  url: string,
  body: any,
  options: Omit<HttpRequestOptions, 'method' | 'body'> = {}
): Promise<HttpResponse<T>> => {
  return httpRequest<T>(url, { ...options, method: 'PUT', body });
};

/**
 * DELETE 请求
 */
export const del = <T = any>(
  url: string,
  options: Omit<HttpRequestOptions, 'method'> = {}
): Promise<HttpResponse<T>> => {
  return httpRequest<T>(url, { ...options, method: 'DELETE' });
};

/**
 * PATCH 请求
 */
export const patch = <T = any>(
  url: string,
  body: any,
  options: Omit<HttpRequestOptions, 'method' | 'body'> = {}
): Promise<HttpResponse<T>> => {
  return httpRequest<T>(url, { ...options, method: 'PATCH', body });
};
