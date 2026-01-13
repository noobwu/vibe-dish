import { ApiConfig, Recommendation, Dish, OrderHistory, UserPreferences } from '../types';
import { post } from './httpService';

const systemPrompt = `
**角色**：你是一个专业的点餐挑选助手,擅长根据用户提供的简单信息、合作商家的食物接口数据(名称、价格、口味标签)和用户最近30天历史订单接口数据(仅菜品名称和口味标签),给出符合预算、用户口味、用户年龄、健康且适合点餐人的食物推荐。

**任务**：基于用户输入的 **性别、年龄、用户口味、预算范围**,生成 **5个菜品选项**,确保推荐:
1. **符合预算**(严格在用户设定的价格区间内)。
2. **贴合口味**(若用户提供了口味关键词,优先匹配)。
3. **多样化**(避免同类重复,如不推荐3个"红烧肉")。
4. **简洁描述**(每个推荐用 **10字以内** 概括,如"小炒黄牛肉")。

**输出格式**(严格遵循):
1. [食物1名称] - [简短特点,如"手撕包菜"]
2. [食物2名称] - [简短特点,如"农家一碗香"]
3. [食物3名称] - [简短特点,如"爆炒猪肝"]

**限制规则**:
- 不推荐具体品牌或菜品链接。
- 不涉及医疗、宗教、政治等敏感领域。
- 若用户未提供口味,按年龄和性别默认推荐(如年轻人→"店铺招牌食物",长辈→"清淡食物")。

**示例输入**:
- 性别:女 | 年龄:25 | 口味:辣 | 预算:15-50元

**示例输出**:
1. 手撕包菜 - 经典下饭
2. 农家一碗香 - 家常味道
3. 爆炒猪肝 - 香嫩下饭
`;

/**
 * LLM API 接口响应格式
 */
interface LLMApiResponse {
    id: string;
    choices: Array<{
        message: {
            role: string;
            content: string;
            reasoning_content?: string;
        };
        finish_reason: string;
    }>;
}

export const generateRecommendations = async (
    config: ApiConfig,
    preferences: UserPreferences,
    dishes: Dish[],
    orderHistory: OrderHistory[]
): Promise<Recommendation[]> => {
    const tasteMap: Record<string, string> = {
        spicy: '辣',
        light: '清淡',
        sweet: '酸甜',
        random: '随机'
    };

    const tasteText = preferences.taste === 'random' ? '随机' : tasteMap[preferences.taste];
    const genderText = preferences.gender === 'male' ? '男' : '女';

    const userContent = `性别:${genderText} | 年龄:${preferences.age} | 口味:${tasteText} | 预算:${preferences.budgetMin}-${preferences.budgetMax}元

可选择的菜品:
${dishes.map(d => `${d.name} (${d.price}元) - ${d.tags.join(', ')}`).join('\n')}

用户最近30天历史订单:
${orderHistory.map(o => o.dishName + ' - ' + o.tags.join(', ')).join('\n')}`;

    try {
        // 使用通用的 HTTP 请求服务
        const response = await post<LLMApiResponse>(
            config.apiUrl,
            {
                model: config.model,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userContent
                    }
                ],
                stream: false,
                max_tokens: 512,
                enable_thinking: false
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`
                },
                timeout: 60000, // 60秒超时
                maxRetries: 3, // 最大重试3次
                retryDelay: 1000, // 重试延迟1秒
                enableLog: true // 启用日志
            }
        );

        // 解析响应
        if (response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
            const content = response.data.choices[0].message.content;
            return parseRecommendations(content);
        } else {
            throw new Error('API返回格式错误');
        }
    } catch (error: any) {
        console.error('调用LLM API失败:', error.message);
        throw error;
    }
};

const parseRecommendations = (content: string): Recommendation[] => {
    const lines = content.split('\n').filter(line => line.trim());
    const recommendations: Recommendation[] = [];

    for (const line of lines) {
        const match = line.match(/^\d+\.\s*(.+?)\s*-\s*(.+)$/);
        if (match) {
            recommendations.push({
                dishName: match[1].trim(),
                feature: match[2].trim()
            });
        }
    }

    return recommendations;
};
