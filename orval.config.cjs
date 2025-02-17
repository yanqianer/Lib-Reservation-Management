




module.exports = {
    'petstore-file': {
      input: 'http://localhost:3000/api-json',
      output:  {
        target: "./src/orval-test/client.ts",  // 生成代码的路径
        client: "axios",  // 使用 Axios 或 fetch
        mode: "split",  // 生成模式（单个文件或多个文件）
        override: {
          mutator: {
            path: "./src/orval-test/custom-instance.ts",  // 自定义请求实例（可选）
            name: "customInstance",
          },
        },
      },
      // override: {
      //   mutator: {
      //     path: './orval-test/custom-instance.ts',
      //     name: 'customInstance',
      //   },
      // },
      // hooks: {
      //   afterAllFilesWrite: "prettier --write",  // 生成后格式化代码
      // },
    },
  };
