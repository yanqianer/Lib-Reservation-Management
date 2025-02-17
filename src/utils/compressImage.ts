export const compressImage = (
    file: File,
    maxWidth: number = 800,
    quality: number = 0.8
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('无法获取 Canvas 上下文'));
            return;
          }
  
          // 计算压缩后的尺寸
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
  
          // 设置 canvas 尺寸
          canvas.width = width;
          canvas.height = height;
  
          // 绘制图片
          ctx.drawImage(img, 0, 0, width, height);
  
          // 转换为 Blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Blob 生成失败'));
              }
            },
            'image/jpeg',
            quality
          );
        };
  
        img.src = event.target?.result as string;
      };
  
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  