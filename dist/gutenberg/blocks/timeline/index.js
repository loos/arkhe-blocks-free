(()=>{var e={8493:(e,t,n)=>{"use strict";const r=window.wp.element,l=window.wp.i18n,a=window.wp.blocks,s=window.wp.blockEditor,i="function"==typeof s.useInnerBlocksProps?s.useInnerBlocksProps:s.__experimentalUseInnerBlocksProps,o=JSON.parse('{"u2":"arkhe-blocks/timeline"}'),c=(0,r.createElement)("svg",{viewBox:"0 0 56 56"},(0,r.createElement)("rect",{x:"11.5",y:"5",width:"2",height:"46"}),(0,r.createElement)("circle",{cx:"12.5",cy:"38",r:"5"}),(0,r.createElement)("circle",{cx:"12.5",cy:"18",r:"5"}),(0,r.createElement)("rect",{x:"24.5",y:"17",width:"24",height:"2"}),(0,r.createElement)("rect",{x:"24.5",y:"37",width:"24",height:"2"})),m={name:"arkhe-blocks/timeline-item",attributes:{title:"Timeline title.",label:"YYYY.MM.DD"},innerBlocks:[{name:"core/paragraph",attributes:{content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."}}]},u={innerBlocks:[m,m,m]},p=window.wp.components,b=(0,r.createElement)("svg",{viewBox:"0 0 40 40","aria-hidden":"true",width:"20",height:"20"},(0,r.createElement)("polygon",{points:"38.3,39 36.3,39 36.3,33.5 3.7,33.5 3.7,39 1.7,39 1.7,31.5 38.3,31.5 "}),(0,r.createElement)("g",null,(0,r.createElement)("rect",{x:"19",y:"6",width:"2",height:"18"}),(0,r.createElement)("polygon",{points:"20,1 12,7.1 28,7.1 \t"}),(0,r.createElement)("polygon",{points:"20,28.9 28,22.7 12,22.7 \t"})));var k=n(1991),d=n.n(k);const h=(e,t)=>-1!==e.split(" ").indexOf(t),f=[{icon:(0,r.createElement)("span",{className:"arkb-null-icon"}),size:"0",title:"0",mbClass:"u-mt-0"},{icon:(0,r.createElement)("span",{className:"arkb-null-icon"}),size:"0.5rem",title:"0.5rem",mbClass:"u-mt-5"},{icon:(0,r.createElement)("span",{className:"arkb-null-icon"}),size:"1rem",title:"1rem",mbClass:"u-mt-10"},{icon:(0,r.createElement)("span",{className:"arkb-null-icon"}),size:"1.5rem",title:"1.5rem",mbClass:"u-mt-15"},{icon:(0,r.createElement)("span",{className:"arkb-null-icon"}),size:"2rem",title:"2rem",mbClass:"u-mt-20"},{icon:(0,r.createElement)("span",{className:"arkb-null-icon"}),size:"3rem",title:"3rem",mbClass:"u-mt-30"},{icon:(0,r.createElement)("span",{className:"arkb-null-icon"}),size:"4rem",title:"4rem",mbClass:"u-mt-40"},{icon:(0,r.createElement)("span",{className:"arkb-null-icon"}),size:"6rem",title:"6rem",mbClass:"u-mt-60"},{icon:(0,r.createElement)("span",{className:"arkb-null-icon"}),size:"8rem",title:"8rem",mbClass:"u-mt-80"}],E=f.map((e=>e.mbClass)),v=(0,r.memo)((e=>{let{className:t,setAttributes:n}=e;if(!window.arkbSettings?.isArkhe)return null;const a=t||"";let s;f.forEach((e=>{h(a,e.mbClass)&&(s=e)}));const i=s?s.mbClass:"";return(0,r.createElement)(p.ToolbarGroup,{className:"arkb-toolbar",isCollapsed:!0,icon:s?(0,r.createElement)("span",{className:"arkb-toolbtn--margin"},b,s.size):b,label:(0,l.__)("Margins on the block","arkhe-blocks"),controls:f.map((e=>{const{mbClass:t}=e,r=i===t;return{...e,isActive:r,onClick:()=>{const e=function(e,t,n){let r,l=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"";if(h(e,t))return e;if(n){const t={};n.map((e=>{t[e]=!1})),l&&(t[l]=!1),r=d()(e,t)}return""!==t&&(r=d()(r,l,t)),r}(a,r?"":t,E);n({className:e})}}}))})})),g="ark-block-timeline";(0,a.registerBlockType)(o.u2,{title:(0,l.__)("Timeline","arkhe-blocks"),description:(0,l.__)("Create timeline format content.","arkhe-blocks"),icon:c,example:u,edit:e=>{let{attributes:t,setAttributes:n,isSelected:l}=e;const a=(0,s.useBlockProps)({className:`${g} ark-has-guide`}),o=i(a,{allowedBlocks:["arkhe-blocks/timeline-item"],template:[["arkhe-blocks/timeline-item"],["arkhe-blocks/timeline-item"]],templateLock:!1,renderAppender:!!l&&s.InnerBlocks.ButtonBlockAppender});return(0,r.createElement)(r.Fragment,null,(0,r.createElement)(s.BlockControls,null,(0,r.createElement)(v,{className:t.className,setAttributes:n})),(0,r.createElement)("div",o))},save:()=>{const e=s.useBlockProps.save({className:`${g}`});return(0,r.createElement)("div",e,(0,r.createElement)(s.InnerBlocks.Content,null))}})},1991:(e,t)=>{var n;!function(){"use strict";var r=function(){function e(){}function t(e,t){for(var n=t.length,r=0;r<n;++r)l(e,t[r])}e.prototype=Object.create(null);var n={}.hasOwnProperty,r=/\s+/;function l(e,l){if(l){var a=typeof l;"string"===a?function(e,t){for(var n=t.split(r),l=n.length,a=0;a<l;++a)e[n[a]]=!0}(e,l):Array.isArray(l)?t(e,l):"object"===a?function(e,t){if(t.toString===Object.prototype.toString)for(var r in t)n.call(t,r)&&(e[r]=!!t[r]);else e[t.toString()]=!0}(e,l):"number"===a&&function(e,t){e[t]=!0}(e,l)}}return function(){for(var n=arguments.length,r=Array(n),l=0;l<n;l++)r[l]=arguments[l];var a=new e;t(a,r);var s=[];for(var i in a)a[i]&&s.push(i);return s.join(" ")}}();e.exports?(r.default=r,e.exports=r):void 0===(n=function(){return r}.apply(t,[]))||(e.exports=n)}()}},t={};function n(r){var l=t[r];if(void 0!==l)return l.exports;var a=t[r]={exports:{}};return e[r](a,a.exports,n),a.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n(8493)})();