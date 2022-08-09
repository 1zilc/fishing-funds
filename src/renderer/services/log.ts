import request from '@/utils/request';

// 获取更新内容
export async function GetLog() {
  try {
    const { body: data } = await request<
      {
        published_at: string;
        tag_name: string;
        body: string;
      }[]
    >(`https://api.github.com/repos/1zilc/fishing-funds/releases`, {
      responseType: 'json',
    });
    return data.map((item) => {
      return {
        date: new Date(item.published_at).toLocaleDateString().replace(/\//g, '-'),
        version: item.tag_name,
        contents: item.body.split(`\r\n`),
      };
    });
  } catch (error) {
    return [];
  }
}
