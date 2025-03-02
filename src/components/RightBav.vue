<template>

<div class="hidden md:block  h-screen pl-1  dark:bg-gray-800 border-gray-200 w-full bg-white overflow-y-auto pt-20">
            <h2 class="text-2xl font-semibold mb-4">大纲</h2>
            <ul class="space-y-2">
                <li v-for="(anchor, index) in titles" :key="index">
                    <a 
                        @click="handleAnchorClick(anchor)" 
                        :class="['block cursor-pointer hover:bg-gray-100 transition text-sm text-slate-500 rounded-lg', 
                                 { 'bg-blue-100 text-blue-600': activeAnchor === anchor.lineIndex }]"
                        :style="{ paddingLeft: `${anchor.indent * 15}px` }">
                        {{ anchor.title }}
                    </a>
                </li>
            </ul>
        </div>

</template>

<script setup lang='ts'>
import {onMounted, ref, watch} from 'vue'
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import { PreviewStore } from '@/stores/counter';
import { ActiveAnchoStore } from '@/stores/counter';
const activeAnchor = ref<string | null>(null);
interface Anchor {
    title: string;
    lineIndex: string | null;
    indent: number;
}
const preview = ref<InstanceType<typeof VMdPreview> | null>(PreviewStore().preview);


const titles = ref<Anchor[]>([]);


const handleAnchorClick = (anchor: Anchor) => {
    if (!preview.value || !anchor.lineIndex) return;

    const heading = preview.value.$el.querySelector(`[data-v-md-line="${anchor.lineIndex}"]`);

    if (heading) {
        preview.value.scrollToTarget({
            target: heading,
            scrollContainer: window,
            top: 60,
        });
        PreviewStore().setPreview(preview.value)
    }
};

const generateTOC = () => {
    if (!preview.value) return;

    const anchors = preview.value.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');
    const titlesArray = Array.from(anchors).filter((title: any) => !!title.textContent?.trim());

    if (!titlesArray.length) {
        titles.value = [];
        return;
    }

    const hTags = Array.from(new Set(titlesArray.map((title: any) => title.tagName))).sort();

    titles.value = titlesArray.map((el: any) => ({
        title: el.textContent || '',
        lineIndex: el.getAttribute('data-v-md-line'),
        indent: hTags.indexOf(el.tagName),
    }));
};
watch(()=>PreviewStore().preview,(newVal)=>{
    if(newVal){
       
        preview.value = PreviewStore().preview
        generateTOC()
    }
},{immediate:true})
watch(()=>ActiveAnchoStore().activeAncho,(newVal)=>{
 
    if(newVal){
        activeAnchor.value = ActiveAnchoStore().activeAncho

    }
},{immediate:true})

onMounted(()=>{
    generateTOC();

})
</script>
<style>

</style>