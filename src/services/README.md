# HTTP 服务使用指南

## 概述

`httpService.ts` 提供了带重试机制和超时控制的通用 HTTP 请求方法，可在项目中任何地方使用。

## 基础用法

### 1. GET 请求

```typescript
import { get } from './services/httpService';

// 基础 GET 请求
const response = await get('https://api.example.com/data');
console.log(response.data);

// 带参数的 GET 请求
const response = await get('https://api.example.com/data?id=123');

// 自定义超时和重试
const response = await get('https://api.example.com/data', {
  timeout: 30000,      // 30秒超时
  maxRetries: 5,       // 最多重试5次
  retryDelay: 2000,    // 重试延迟2秒
  enableLog: false     // 关闭日志
});
```

### 2. POST 请求

```typescript
import { post } from './services/httpService';

// 基础 POST 请求
const response = await post(
  'https://api.example.com/create',
  { name: 'test', value: 123 }
);

// 带请求头的 POST 请求
const response = await post(
  'https://api.example.com/create',
  { name: 'test' },
  {
    headers: {
      'Authorization': 'Bearer your-token',
      'X-Custom-Header': 'custom-value'
    },
    timeout: 60000,
    maxRetries: 3
  }
);
```

### 3. PUT 请求

```typescript
import { put } from './services/httpService';

const response = await put(
  'https://api.example.com/update/123',
  { name: 'updated' }
);
```

### 4. DELETE 请求

```typescript
import { del } from './services/httpService';

const response = await del('https://api.example.com/delete/123');
```

### 5. PATCH 请求

```typescript
import { patch } from './services/httpService';

const response = await patch(
  'https://api.example.com/patch/123',
  { field: 'value' }
);
```

## 高级用法

### 1. 自定义 HTTP 方法

```typescript
import { httpRequest } from './services/httpService';

const response = await httpRequest('https://api.example.com/data', {
  method: 'POST',
  body: { key: 'value' },
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000,      // 2分钟超时
  maxRetries: 5,        // 重试5次
  retryDelay: 3000,      // 延迟3秒
  enableLog: true        // 启用日志
});
```

### 2. 类型安全的响应

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const response = await get<User>('https://api.example.com/user/123');
console.log(response.data.name); // TypeScript 会自动补全
```

## 配置选项

### HttpRequestOptions

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| method | 'GET' \| 'POST' \| 'PUT' \| 'DELETE' \| 'PATCH' | 'GET' | HTTP 方法 |
| headers | Record<string, string> | {} | 请求头 |
| body | any | undefined | 请求体（POST/PUT/PATCH） |
| timeout | number | 60000 | 超时时间（毫秒） |
| maxRetries | number | 3 | 最大重试次数 |
| retryDelay | number | 1000 | 重试延迟（毫秒） |
| enableLog | boolean | true | 是否启用日志 |

### HttpResponse

```typescript
interface HttpResponse<T = any> {
  data: T;           // 响应数据
  status: number;     // HTTP 状态码
  statusText: string; // HTTP 状态文本
}
```

## 实际应用示例

### 示例 1：调用 LLM API（已在项目中使用）

```typescript
// src/services/llmService.ts
import { post } from './httpService';

const response = await post(
  apiUrl,
  {
    model: 'Qwen/Qwen3-8B',
    messages: [...]
  },
  {
    headers: { 'Authorization': `Bearer ${apiKey}` },
    timeout: 60000,
    maxRetries: 3,
    retryDelay: 1000
  }
);
```

### 示例 2：获取用户信息

```typescript
import { get } from '@/services/httpService';

interface UserInfo {
  id: string;
  name: string;
  avatar: string;
}

const fetchUserInfo = async (userId: string) => {
  try {
    const response = await get<UserInfo>(
      `https://api.example.com/users/${userId}`,
      {
        timeout: 5000,
        maxRetries: 2
      }
    );
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};
```

### 示例 3：提交订单

```typescript
import { post } from '@/services/httpService';

interface OrderData {
  items: Array<{ id: string; quantity: number }>;
  total: number;
  address: string;
}

const submitOrder = async (orderData: OrderData) => {
  try {
    const response = await post<{ orderId: string }>(
      'https://api.example.com/orders',
      orderData,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        timeout: 30000,
        maxRetries: 2
      }
    );
    return response.data.orderId;
  } catch (error) {
    console.error('提交订单失败:', error);
    throw error;
  }
};
```

## 错误处理

所有请求在失败时会抛出异常，建议使用 try-catch 捕获：

```typescript
try {
  const response = await get('https://api.example.com/data');
  console.log(response.data);
} catch (error) {
  console.error('请求失败:', error.message);
  // 处理错误，例如显示错误提示
}
```

## 日志输出

启用日志时（`enableLog: true`），会在控制台输出详细日志：

```
[HttpService] 请求 GET https://api.example.com/data (第1次尝试)
[HttpService] 请求成功，状态: 200

或失败时：
[HttpService] 请求失败: HTTP 500: Internal Server Error
[HttpService] 1000ms 后进行第 2 次重试...
[HttpService] 请求 GET https://api.example.com/data (第2次尝试)
[HttpService] 请求成功，状态: 200
```

## 特性

✅ **自动重试**：网络不稳定时自动重试
✅ **超时控制**：防止请求长时间挂起
✅ **类型安全**：支持 TypeScript 类型推导
✅ **详细日志**：可选的请求/响应日志
✅ **灵活配置**：可自定义重试策略
✅ **统一接口**：所有 HTTP 方法使用相同配置
✅ **错误处理**：清晰的错误信息和状态码

## 注意事项

1. GET 请求的 body 参数会被忽略
2. 超时时间以毫秒为单位
3. 重试延迟在每次失败后生效
4. 默认会添加 `Content-Type: application/json` 请求头
5. 如需其他 Content-Type，请在 headers 中覆盖
