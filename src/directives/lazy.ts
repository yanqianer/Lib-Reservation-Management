export default {
    mounted(el:any, binding:any) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 图片进入视口时加载
            el.src = binding.value;
            observer.unobserve(el); // 停止观察
          }
        });
      });
      observer.observe(el); // 开始观察
    },
  };