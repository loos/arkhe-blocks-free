(()=>{var e={8596:(e,t,l)=>{"use strict";const a=window.wp.element,n=window.wp.i18n,r=window.wp.blocks,c=window.wp.blockEditor,o=window.wp.components,s="function"==typeof c.useInnerBlocksProps?c.useInnerBlocksProps:c.__experimentalUseInnerBlocksProps,i=JSON.parse('{"u2":"arkhe-blocks/columns"}'),m=(0,a.createElement)("svg",{viewBox:"0 0 56 56"},(0,a.createElement)("path",{d:"M3.5,8C3.2,8,3,8.2,3,8.5v39C3,47.8,3.2,48,3.5,48h49c0.3,0,0.5-0.2,0.5-0.5v-39C53,8.2,52.8,8,52.5,8H3.5z M21.5,10h13 c0.3,0,0.5,0.2,0.5,0.5v17c0,0.3-0.2,0.5-0.5,0.5h-13c-0.3,0-0.5-0.2-0.5-0.5v-17C21,10.2,21.2,10,21.5,10z M5.5,10h13 c0.3,0,0.5,0.2,0.5,0.5v17c0,0.3-0.2,0.5-0.5,0.5h-13C5.2,28,5,27.8,5,27.5v-17C5,10.2,5.2,10,5.5,10z M26.5,46h-21 C5.2,46,5,45.8,5,45.5v-15C5,30.2,5.2,30,5.5,30h21c0.3,0,0.5,0.2,0.5,0.5v15C27,45.8,26.8,46,26.5,46z M50.5,46h-21 c-0.3,0-0.5-0.2-0.5-0.5v-15c0-0.3,0.2-0.5,0.5-0.5h21c0.3,0,0.5,0.2,0.5,0.5v15C51,45.8,50.8,46,50.5,46z M37,27.5v-17 c0-0.3,0.2-0.5,0.5-0.5h13c0.3,0,0.5,0.2,0.5,0.5v17c0,0.3-0.2,0.5-0.5,0.5h-13C37.2,28,37,27.8,37,27.5z"})),u={name:"arkhe-blocks/column",innerBlocks:[{name:"core/paragraph",attributes:{content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}}]},b={innerBlocks:[u,u]};var p=l(1991),d=l.n(p);const k=(e,t)=>-1!==e.split(" ").indexOf(t),v=(e,t)=>`${e?.top||t} ${e?.right||t} ${e?.bottom||t} ${e?.left||t}`,g=e=>e?Math.floor(1e4/e)/100+"%":null,h="ark-block-columns",E=[{supports:{anchor:!0,className:!1,align:["wide","full"]},attributes:{vAlign:{type:"string",default:""},columnCount:{type:"object"},columnWidth:{type:"object"},gap:{type:"object"},isScrollable:{type:"boolean",default:!1}},save:e=>{let{attributes:t}=e;const{vAlign:l,columnCount:n,columnWidth:r,gap:o,isScrollable:s}=t;let i={};i=s?{"--arkb-clmn-w--pc":r?.pc,"--arkb-clmn-w--tab":r?.tab,"--arkb-clmn-w--mb":r?.mobile}:{"--arkb-clmn-w--pc":g(n?.pc),"--arkb-clmn-w--tab":g(n?.tab),"--arkb-clmn-w--mb":g(n?.mobile)};const m=c.useBlockProps.save({className:h,style:{...i,"--arkb-gap--x":o?.x,"--arkb-gap--y":o?.y},"data-valign":l||null,"data-scrollable":s?"1":null});return(0,a.createElement)("div",m,(0,a.createElement)("div",{className:`${h}__inner`},(0,a.createElement)(c.InnerBlocks.Content,null)))}},{supports:{anchor:!0,className:!1,align:["wide","full"]},attributes:{vAlign:{type:"string",default:""},colPC:{type:"string",default:"2"},colTab:{type:"string",default:"2"},colMobile:{type:"string",default:"1"},margin:{type:"object",default:{x:"0.75rem",bottom:"1.5rem"}}},migrate:e=>{const t={...e};if(t.columnCount={pc:parseInt(e.colPC||2),tab:parseInt(e.colTab||2),mobile:parseInt(e.colMobile||1)},!e.margin)return t;const l=e.margin.x,a=e.margin.bottom,{num:n,unit:r}=(e=>{if(!e)return{num:0,unit:"rem"};const t=e.toString(),l=t.replace(/[^0-9\.]/g,""),a=t.replace(/[0-9\.]/g,"");return{num:parseFloat(l),unit:a}})(l),c=`${2*n}${r}`;return t.gap={x:c,y:a},t},save:e=>{let{attributes:t}=e;const{vAlign:l,colPC:n,colTab:r,colMobile:o,margin:s}=t,i=c.useBlockProps.save({className:`${h} arkb-columns`,style:{"--arkb-fb":"1"!==o?g(o):null,"--arkb-fb_tab":"2"!==r?g(r):null,"--arkb-fb_pc":"2"!==n?g(n):null,"--arkb-clmn-mrgn--x":"0.75rem"!==s.x?s.x:null,"--arkb-clmn-mrgn--bttm":"1.5rem"!==s.bottom?s.bottom:null},"data-valign":l||null});return(0,a.createElement)("div",i,(0,a.createElement)(c.InnerBlocks.Content,null))}},{supports:{anchor:!0,className:!1,align:["wide","full"]},attributes:{vAlign:{type:"string",default:""},colPC:{type:"string",source:"attribute",selector:".arkb-columns",attribute:"data-col-pc",default:"2"},colTab:{type:"string",source:"attribute",selector:".arkb-columns",attribute:"data-col-tab",default:"2"},colMobile:{type:"string",source:"attribute",selector:".arkb-columns",attribute:"data-col",default:"1"}},migrate:e=>({...e,margin:{x:"0.75rem",bottom:"1.5rem"}}),save:e=>{let{attributes:t}=e;const l={col1:100,col2:50,col3:33.33,col4:25,col5:20,col6:16.66},{vAlign:n,colPC:r,colTab:o,colMobile:s}=t,i={"--arkb-fb":l[`col${s}`]+"%","--arkb-fb_tab":l[`col${o}`]+"%","--arkb-fb_pc":l[`col${r}`]+"%"},m=c.useBlockProps.save({className:`${h} arkb-columns`,style:i,"data-valign":n||null,"data-col":s,"data-col-tab":o,"data-col-pc":r});return(0,a.createElement)("div",m,(0,a.createElement)(c.InnerBlocks.Content,null))}}],f=!!window.arkbSettings?.pfkey||!1,x=(0,a.createElement)("p",{className:"arkb-proOnlyArea__message"},(0,n.__)("This setting is only available in the Pro version.","arkhe-blocks"),(0,a.createElement)("a",{className:"arkb-proOnlyArea__link",href:"https://arkhe-theme.com/ja/product/arkhe-blocks-pro/",target:"_blank",rel:"noreferrer noopener"},"Go Pro")),_=e=>{let{children:t}=e;return(0,a.createElement)(a.Fragment,null,f?t:(0,a.createElement)("div",{className:"arkb-proOnlyArea"},x,(0,a.createElement)("div",{className:"arkb-proOnlyArea__preview"},t)))},C=window.wp.compose,w="function"==typeof c.UnitControl?c.UnitControl:c.__experimentalUnitControl;var y=l(4184),N=l.n(y);const B=["px","rem","em","%","vw","vh"],S=e=>{let{value:t,units:l,min:r,max:c,onChange:s,defaultUnit:i,steps:m,className:u="",widthRange:b=!1,onClear:p=null}=e;const d=l||B,{num:k,unit:v}=((e,t)=>{if(!e)return{num:"",unit:t||"px"};const l=e.toString(),a=l.replace(/[^0-9\.]/g,""),n=l.replace(/[0-9\.]/g,"");return{num:parseFloat(a),unit:n}})(t,i),g=(0,C.useInstanceId)(w);let h="0.1";return m?h=m?.unit||"0.1":"px"===v?h="1":"rem"!==v&&"em"!==v||(h="0.25"),(0,a.createElement)("div",{className:N()("arkb-unitNumber",u,{"has-clear":!!p})},(0,a.createElement)(w,{id:g,value:k,min:r||0,max:c||void 0,step:h,unit:v,units:d.map((e=>({label:e,value:e}))),onBlur:null,onChange:e=>{s(e)}}),b&&(0,a.createElement)(o.RangeControl,{value:k,onChange:e=>{s(`${e}${v}`)},initialPosition:k,withInputField:!1,step:h,min:r||0,max:c||void 0}),p&&(0,a.createElement)(o.Button,{isSmall:!0,isSecondary:!0,text:(0,n.__)("Clear"),onClick:()=>{p()}}))},z=(0,a.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 56 56"},(0,a.createElement)("path",{d:"M53,44H41V12h12V44z M43,42h8V14h-8V42z"}),(0,a.createElement)("path",{d:"M15,44H3V12h12V44z M5,42h8V14H5V42z"}),(0,a.createElement)("polygon",{points:"39,28 35,24 35,27 21,27 21,24 17,28 21,32 21,29 35,29 35,32 "})),P=(0,a.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 56 56"},(0,a.createElement)("path",{d:"M44,3v12H12V3H44z M42,13V5H14v8H42z"}),(0,a.createElement)("path",{d:"M44,41v12H12V41H44z M42,51v-8H14v8H42z"}),(0,a.createElement)("polygon",{points:"28,17 24,21 27,21 27,35 24,35 28,39 32,35 29,35 29,21 32,21 "})),H=(0,a.memo)((e=>{let{name:t,value:l,setAttributes:r,help:c,successionHelp:s,defaultGap:i={}}=e,m=c||"";s&&(m=(0,n.sprintf)((0,n.__)("If empty, %s is taken over","arkhe-blocks"),s));const u=(e,a)=>{const n=e||void 0,c={...l};void 0===n?delete c[a]:c[a]=n,Object.keys(c).length?r({[t]:c}):r({[t]:void 0})};return(0,a.createElement)("div",{className:"arkb-gapControl"},(0,a.createElement)(o.Flex,{className:"arkb-gapControl__row"},(0,a.createElement)(o.FlexItem,{className:"__label"},(0,a.createElement)(o.Icon,{icon:z,size:"1.5em"}),(0,n._x)("Horizontal","margin","arkhe-blocks")),(0,a.createElement)(o.FlexBlock,null,(0,a.createElement)(S,{value:l?.x||i?.x||"",defaultUnit:"rem",onChange:e=>{u(e,"x")},onClear:()=>{u(void 0,"x")}}))),(0,a.createElement)(o.Flex,{className:"arkb-gapControl__row"},(0,a.createElement)(o.FlexItem,{className:"__label"},(0,a.createElement)(o.Icon,{icon:P,size:"1.5em"}),(0,n._x)("Vertical","margin","arkhe-blocks")),(0,a.createElement)(o.FlexBlock,null,(0,a.createElement)(S,{value:l?.y||i?.y||"",defaultUnit:"rem",onChange:e=>{u(e,"y")},onClear:()=>{u(void 0,"y")}}))),m&&(0,a.createElement)("p",{className:"arkb-helpText u-mt-5"},m))})),M=(0,a.createElement)("svg",{viewBox:"0 0 40 40","aria-hidden":"true",width:"20",height:"20"},(0,a.createElement)("polygon",{points:"38.3,39 36.3,39 36.3,33.5 3.7,33.5 3.7,39 1.7,39 1.7,31.5 38.3,31.5 "}),(0,a.createElement)("g",null,(0,a.createElement)("rect",{x:"19",y:"6",width:"2",height:"18"}),(0,a.createElement)("polygon",{points:"20,1 12,7.1 28,7.1 \t"}),(0,a.createElement)("polygon",{points:"20,28.9 28,22.7 12,22.7 \t"}))),A=[{icon:(0,a.createElement)("span",{className:"arkb-null-icon"}),size:"0",title:"0",mbClass:"u-mt-0"},{icon:(0,a.createElement)("span",{className:"arkb-null-icon"}),size:"0.5rem",title:"0.5rem",mbClass:"u-mt-5"},{icon:(0,a.createElement)("span",{className:"arkb-null-icon"}),size:"1rem",title:"1rem",mbClass:"u-mt-10"},{icon:(0,a.createElement)("span",{className:"arkb-null-icon"}),size:"1.5rem",title:"1.5rem",mbClass:"u-mt-15"},{icon:(0,a.createElement)("span",{className:"arkb-null-icon"}),size:"2rem",title:"2rem",mbClass:"u-mt-20"},{icon:(0,a.createElement)("span",{className:"arkb-null-icon"}),size:"3rem",title:"3rem",mbClass:"u-mt-30"},{icon:(0,a.createElement)("span",{className:"arkb-null-icon"}),size:"4rem",title:"4rem",mbClass:"u-mt-40"},{icon:(0,a.createElement)("span",{className:"arkb-null-icon"}),size:"6rem",title:"6rem",mbClass:"u-mt-60"},{icon:(0,a.createElement)("span",{className:"arkb-null-icon"}),size:"8rem",title:"8rem",mbClass:"u-mt-80"}],V=A.map((e=>e.mbClass)),F=(0,a.memo)((e=>{let{className:t,setAttributes:l}=e;if(!window.arkbSettings?.isArkhe)return null;const r=t||"";let c;A.forEach((e=>{k(r,e.mbClass)&&(c=e)}));const s=c?c.mbClass:"";return(0,a.createElement)(o.ToolbarGroup,{className:"arkb-toolbar",isCollapsed:!0,icon:c?(0,a.createElement)("span",{className:"arkb-toolbtn--margin"},M,c.size):M,label:(0,n.__)("Margins on the block","arkhe-blocks"),controls:A.map((e=>{const{mbClass:t}=e,a=s===t;return{...e,isActive:a,onClick:()=>{const e=function(e,t,l){let a,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"";if(k(e,t)&&(t=""),l){const t={};l.map((e=>{t[e]=!1})),n&&(t[n]=!1),a=d()(e,t)}return""!==t&&(a=d()(a,n,t)),a}(r,t,V);l({className:e})}}}))})})),I=function(e){let{icon:t,size:l=24,...n}=e;return(0,a.cloneElement)(t,{width:l,height:l,...n})},T=window.wp.primitives,$=(0,a.createElement)(T.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,a.createElement)(T.Path,{d:"M20.5 16h-.7V8c0-1.1-.9-2-2-2H6.2c-1.1 0-2 .9-2 2v8h-.7c-.8 0-1.5.7-1.5 1.5h20c0-.8-.7-1.5-1.5-1.5zM5.7 8c0-.3.2-.5.5-.5h11.6c.3 0 .5.2.5.5v7.6H5.7V8z"})),O=(0,a.createElement)(T.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,a.createElement)(T.Path,{d:"M17 4H7c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H7c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h10c.3 0 .5.2.5.5v12zm-7.5-.5h4V16h-4v1.5z"})),j=(0,a.createElement)(T.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,a.createElement)(T.Path,{d:"M15 4H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H9c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h6c.3 0 .5.2.5.5v12zm-4.5-.5h2V16h-2v1.5z"})),U=e=>{let{className:t,controlPC:l,controlSP:n,controlTab:r,isHideTab:c}=e;const s=[{name:"pc",title:(0,a.createElement)(a.Fragment,null,(0,a.createElement)(I,{icon:$}),(0,a.createElement)("span",null,"PC")),className:"__pc"}];r&&s.push({name:"tab",title:(0,a.createElement)(a.Fragment,null,(0,a.createElement)(I,{icon:O}),(0,a.createElement)("span",null,"Tab")),className:"__tab"}),s.push({name:"sp",title:(0,a.createElement)(a.Fragment,null,(0,a.createElement)(I,{icon:j}),(0,a.createElement)("span",null,"SP")),className:"__sp"});let i="arkb-tabPanel -device";return t&&(i+=` ${t}`),c&&(i+=" is-hide"),(0,a.createElement)(o.TabPanel,{className:i,activeClass:"is-active",tabs:s,initialTabName:"pc"},(e=>"pc"===e.name?l:"tab"===e.name?r:"sp"===e.name?n:void 0))},W={pc:void 0,tab:void 0,mobile:void 0},L=(0,a.memo)((e=>{let{columnWidth:t,setAttributes:l,defaultUnit:n,defaultWidth:r,isLinked:c}=e;const s=r||W,i=(e,a)=>{l(c?{columnWidth:{pc:a,tab:a,mobile:a}}:{columnWidth:{...t,[e]:a}})},m=t?.pc||"",u=m.match(/px/)?void 0:100,b=t?.tab||"",p=b.match(/px/)?void 0:100,d=t?.mobile||"",k=d.match(/px/)?void 0:100;return(0,a.createElement)("div",{className:"arkb-columnWidthControl"},(0,a.createElement)(o.Flex,null,(0,a.createElement)(o.FlexItem,null,(0,a.createElement)(I,{icon:$})),(0,a.createElement)(o.FlexBlock,null,(0,a.createElement)(S,{value:m,max:u,defaultUnit:n||"",units:["em","px","vw","%"],onChange:e=>{i("pc",e)},onClear:()=>{i("pc",s?.pc||void 0)}}))),(0,a.createElement)(o.Flex,null,(0,a.createElement)(o.FlexItem,null,(0,a.createElement)(I,{icon:O})),(0,a.createElement)(o.FlexBlock,null,(0,a.createElement)(S,{value:b,max:p,defaultUnit:n||"",units:["em","px","vw","%"],onChange:e=>{i("tab",e)},onClear:()=>{i("tab",s?.tab||void 0)}}))),(0,a.createElement)(o.Flex,null,(0,a.createElement)(o.FlexItem,null,(0,a.createElement)(I,{icon:j})),(0,a.createElement)(o.FlexBlock,null,(0,a.createElement)(S,{value:d,max:k,defaultUnit:n||"",units:["em","px","vw","%"],onChange:e=>{i("mobile",e)},onClear:()=>{i("mobile",s?.mobile||void 0)}}))))})),G={pc:2,tab:2,mobile:1},R=(0,a.memo)((e=>{let{columnCount:t,defaultCount:l,setAttributes:n,min:r=1,max:c=8}=e;const s=l||G,i=(e,l)=>{const a={...t};void 0===l||s[e]===l?delete a[e]:a[e]=l,Object.keys(a).length?n({columnCount:a}):n({columnCount:void 0})};return(0,a.createElement)("div",{className:"arkb-columnCountControl"},(0,a.createElement)(o.Flex,null,(0,a.createElement)(o.FlexItem,null,(0,a.createElement)(I,{icon:$})),(0,a.createElement)(o.FlexBlock,null,(0,a.createElement)(o.RangeControl,{value:t?.pc||s.pc,onChange:e=>{i("pc",e)},min:r,max:c}))),(0,a.createElement)(o.Flex,null,(0,a.createElement)(o.FlexItem,null,(0,a.createElement)(I,{icon:O})),(0,a.createElement)(o.FlexBlock,null,(0,a.createElement)(o.RangeControl,{value:t?.tab||s.tab,onChange:e=>{i("tab",e)},min:r,max:c}))),(0,a.createElement)(o.Flex,null,(0,a.createElement)(o.FlexItem,null,(0,a.createElement)(I,{icon:j})),(0,a.createElement)(o.FlexBlock,null,(0,a.createElement)(o.RangeControl,{value:t?.mobile||s.mobile,onChange:e=>{i("mobile",e)},min:r,max:c}))))}));function q(){return q=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var l=arguments[t];for(var a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a])}return e},q.apply(this,arguments)}const D=(0,a.createElement)(T.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,a.createElement)(T.Path,{d:"M15.6 7.2H14v1.5h1.6c2 0 3.7 1.7 3.7 3.7s-1.7 3.7-3.7 3.7H14v1.5h1.6c2.8 0 5.2-2.3 5.2-5.2 0-2.9-2.3-5.2-5.2-5.2zM4.7 12.4c0-2 1.7-3.7 3.7-3.7H10V7.2H8.4c-2.9 0-5.2 2.3-5.2 5.2 0 2.9 2.3 5.2 5.2 5.2H10v-1.5H8.4c-2 0-3.7-1.7-3.7-3.7zm4.6.9h5.3v-1.5H9.3v1.5z"})),J=(0,a.createElement)(T.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,a.createElement)(T.Path,{d:"M15.6 7.3h-.7l1.6-3.5-.9-.4-3.9 8.5H9v1.5h2l-1.3 2.8H8.4c-2 0-3.7-1.7-3.7-3.7s1.7-3.7 3.7-3.7H10V7.3H8.4c-2.9 0-5.2 2.3-5.2 5.2 0 2.9 2.3 5.2 5.2 5.2H9l-1.4 3.2.9.4 5.7-12.5h1.4c2 0 3.7 1.7 3.7 3.7s-1.7 3.7-3.7 3.7H14v1.5h1.6c2.9 0 5.2-2.3 5.2-5.2 0-2.9-2.4-5.2-5.2-5.2z"})),K=e=>{let{isLinked:t,...l}=e;const r=t?(0,n.__)("Unlink Sides"):(0,n.__)("Link Sides");return(0,a.createElement)(o.Tooltip,{text:r},(0,a.createElement)("span",{className:"__link"},(0,a.createElement)(o.Button,q({},l,{className:"component-box-control__linked-button",isPrimary:t,isSecondary:!t,isSmall:!0,icon:t?D:J,iconSize:16,"aria-label":r}))))},Q=(0,a.memo)((e=>{let{name:t,value:l,setAttributes:r,help:c,successionHelp:s,nullValue:i,resetValue:m,defaultOpen:u=!1,clearable:b=!1}=e;const[p,d]=(0,a.useState)(!u&&(e=>{const t=[e?.top,e?.right,e?.bottom,e?.left];return t.every((e=>e===t[0]))})(l));let k=c||"";s&&p?k=(0,n.sprintf)((0,n.__)("If empty, %s is taken over","arkhe-blocks"),s):s&&!p&&(k=(0,n.sprintf)((0,n.__)("If all are empty, %s will be taken over","arkhe-blocks"),s));const v=(e,a)=>{const n=e||i||void 0;if(p)r(void 0===(c=n)?{[t]:void 0}:{[t]:{...l,top:c,left:c,right:c,bottom:c}});else{const e={...l};void 0===n?delete e[a]:e[a]=n,Object.keys(e).length?r({[t]:e}):r({[t]:void 0})}var c};return(0,a.createElement)(a.Fragment,null,(0,a.createElement)("div",{className:"arkb-ctrl--paddings"},(0,a.createElement)("div",{className:"__inner","data-is-linked":p},(0,a.createElement)(K,{onClick:()=>{d(!p)},isLinked:p}),(0,a.createElement)("div",{className:"__center"},(0,a.createElement)("span",{className:"__box--top"}),(0,a.createElement)("span",{className:"__box--left"}),(0,a.createElement)("span",{className:"__box--right"}),(0,a.createElement)("span",{className:"__box--bottom"})),(0,a.createElement)(S,{defaultUnit:"rem",className:"__top",value:l?.top||"",onChange:e=>{v(e,"top")}}),(0,a.createElement)(S,{defaultUnit:"rem",className:"__bottom",value:l?.bottom||"",onChange:e=>{v(e,"bottom")}}),(0,a.createElement)(S,{defaultUnit:"rem",className:"__left",value:l?.left||"",onChange:e=>{v(e,"left")}}),(0,a.createElement)(S,{className:"__right",value:l?.right||"",onChange:e=>{v(e,"right")}})),k&&(0,a.createElement)("p",{className:"arkb-helpText u-mt-5"},k),b&&(0,a.createElement)(o.Button,{className:"__clear",isSmall:!0,isSecondary:!0,text:(0,n.__)("Clear"),onClick:()=>{r({[t]:void 0})}}),m&&(0,a.createElement)(o.Button,{className:"__clear",isSmall:!0,isSecondary:!0,text:(0,n.__)("Reset","arkhe-blocks"),onClick:()=>{r({[t]:m})}})))}));function X(e){let{style:t}=e;if(!a.Platform.isWeb)return null;const l=void 0!==c.BlockList.__unstableElementContext?(0,a.useContext)(c.BlockList.__unstableElementContext):document.querySelector("head");return t&&l?(0,a.createPortal)((0,a.createElement)((()=>(0,a.createElement)("style",null,t)),null),l):null}function Y(e){let t="";return Object.keys(e).forEach((l=>{const a=e[l];""!==a&&(t+=`${l}:${a};`)})),t}const Z=!!window.arkbSettings?.pfkey||!1,ee={pc:"400px",tab:"400px",mobile:"300px"},te="ark-block-columns";(0,r.registerBlockType)(i.u2,{title:(0,n.__)("Rich columns","arkhe-blocks"),icon:m,styles:[{name:"default",label:(0,n.__)("Default","arkhe-blocks"),isDefault:!0},{name:"shadow",label:(0,n._x)("Shadow","style","arkhe-blocks")}],example:b,transforms:{from:[{type:"block",blocks:["core/columns"],transform:(e,t)=>{const l=[];return t.forEach((e=>{l.push((0,r.createBlock)("arkhe-blocks/column",{},e.innerBlocks))})),(0,r.createBlock)(i.u2,{},l)}}]},edit:e=>{let{clientId:t,attributes:l,setAttributes:r,isSelected:i}=e;const{vAlign:m,columnCount:u,columnWidth:b,gap:p,gapTab:d,gapMB:k,padding:h,paddingTab:E,paddingMB:f,isScrollable:x}=l;let C={};C=x?{"--arkb-clmn-w--pc":b?.pc,"--arkb-clmn-w--tab":b?.tab,"--arkb-clmn-w--mb":b?.mobile}:{"--arkb-clmn-w--pc":g(u?.pc),"--arkb-clmn-w--tab":g(u?.tab),"--arkb-clmn-w--mb":g(u?.mobile)};const w=(0,c.useBlockProps)({className:N()(te,"ark-has-guide"),style:{...C},"data-valign":m||null,"data-scrollable":x?"1":null}),y=s({className:"ark-block-columns__inner"},{allowedBlocks:["arkhe-blocks/column"],template:[["arkhe-blocks/column"],["arkhe-blocks/column"]],templateLock:!1,orientation:"horizontal",renderAppender:!!i&&c.InnerBlocks.ButtonBlockAppender}),B=function(e){let{gap:t,gapTab:l,gapMB:a,padding:n,paddingTab:r,paddingMB:c,clientId:o}=e;return function(e,t){let l="",a="";return t?.all&&(a=Y(t.all),a&&(l+=`${e}{${a}}`)),t?.pc&&(a=Y(t.pc),a&&(l+=`\n\t\t\t@media (min-width: 1000px) {\n\t\t\t\t${e}{${a}}\n\t\t\t}`)),t?.sp&&(a=Y(t.sp),a&&(l+=`\n\t\t\t@media not all and (min-width: 1000px) {\n\t\t\t\t${e}{${a}}\n\t\t\t}`)),t?.tab&&(a=Y(t.tab),a&&(l+=`\n\t\t\t@media (min-width: 600px) {\n\t\t\t\t${e}{${a}}\n\t\t\t}`)),t?.mb&&(a=Y(t.mb),a&&(l+=`\n\t\t\t@media not all and (min-width: 600px) {\n\t\t\t\t${e}{${a}}\n\t\t\t}`)),l}(`#block-${o}`,{all:{"--arkb-gap--x":t?.x||"","--arkb-gap--y":t?.y||"","--arkb-padding":n?v(n,"var(--arkb-padding--default)"):""},sp:{"--arkb-gap--x":l?.x||"","--arkb-gap--y":l?.y||"","--arkb-padding":r?v(r,"var(--arkb-padding--default)"):""},mb:{"--arkb-gap--x":a?.x||"","--arkb-gap--y":a?.y||"","--arkb-padding":c?v(c,"var(--arkb-padding--default)"):""}})}({gap:p,gapTab:d,gapMB:k,padding:h,paddingTab:E,paddingMB:f,clientId:t});return(0,a.createElement)(a.Fragment,null,B&&(0,a.createElement)(X,{style:B}),(0,a.createElement)(c.BlockControls,{group:"block"},(0,a.createElement)(c.BlockVerticalAlignmentToolbar,{onChange:e=>{r({vAlign:e})},value:m})),(0,a.createElement)(c.BlockControls,null,(0,a.createElement)(F,{className:l.className,setAttributes:r})),(0,a.createElement)(c.InspectorControls,null,(0,a.createElement)(o.PanelBody,{title:(0,n.__)("Settings","arkhe-blocks")},(0,a.createElement)(o.ToggleControl,{label:(0,n.__)("Scroll horizontally","arkhe-blocks"),checked:x,onChange:e=>{r(e?{isScrollable:!0,columnCount:void 0,columnWidth:ee}:{isScrollable:!1,columnWidth:void 0})}}),x&&(0,a.createElement)(o.BaseControl,null,(0,a.createElement)(o.BaseControl.VisualLabel,null,(0,n.__)("Column Width","arkhe-blocks")),(0,a.createElement)(L,{columnWidth:b,defaultWidth:ee,setAttributes:r})),!x&&(0,a.createElement)(o.BaseControl,null,(0,a.createElement)(o.BaseControl.VisualLabel,null,(0,n.__)("Number of columns","arkhe-blocks")),(0,a.createElement)(R,{columnCount:u,setAttributes:r})),(0,a.createElement)(_,null,(0,a.createElement)(o.BaseControl,{className:"u-mb-25"},(0,a.createElement)(o.BaseControl.VisualLabel,null,(0,n.__)("Margin between columns","arkhe-blocks")),(0,a.createElement)(U,{className:"-gap -triple",controlPC:(0,a.createElement)(H,{value:p,name:"gap",setAttributes:Z?r:null,defaultGap:{x:"1.5rem",y:"1.5rem"}}),controlTab:(0,a.createElement)(H,{value:d,name:"gapTab",setAttributes:Z?r:null,successionHelp:(0,n.__)("PC setting","arkhe-blocks")}),controlSP:(0,a.createElement)(H,{value:k,name:"gapMB",setAttributes:Z?r:null,successionHelp:(0,n.__)("Tablet setting","arkhe-blocks")})})),(0,a.createElement)(o.BaseControl,null,(0,a.createElement)(o.BaseControl.VisualLabel,null,(0,n.__)("Padding in cloumns","arkhe-blocks")),(0,a.createElement)(U,{className:"-padding -triple",controlPC:(0,a.createElement)(Q,{name:"padding",value:h,setAttributes:Z?r:null,clearable:!0}),controlTab:(0,a.createElement)(Q,{name:"paddingTab",value:E,setAttributes:Z?r:null,clearable:!0,successionHelp:(0,n.__)("PC setting","arkhe-blocks")}),controlSP:(0,a.createElement)(Q,{name:"paddingMB",value:f,setAttributes:Z?r:null,clearable:!0,successionHelp:(0,n.__)("Tablet setting","arkhe-blocks")})}))))),(0,a.createElement)("div",w,x&&(0,a.createElement)("div",{className:"arkb-scrollHint"},(0,a.createElement)("span",{className:"arkb-scrollHint__text"},(0,n.__)("Scrollable","arkhe-blocks"),(0,a.createElement)("svg",{className:"arkb-scrollHint__svg",width:"1em",height:"1em",viewBox:"0 0 32 32",role:"img",focusable:"false"},(0,a.createElement)("path",{d:"M30.4 16.664l-4.528-4.528-1.128 1.136 3.392 3.392h-26.536v1.6h28.8v-1.6z"})))),(0,a.createElement)("div",y)))},save:e=>{let{attributes:t}=e;const{vAlign:l,isScrollable:n}=t,r=c.useBlockProps.save({className:te,"data-valign":l||null,"data-scrollable":n?"1":null});return(0,a.createElement)("div",r,(0,a.createElement)("div",{className:"ark-block-columns__inner"},(0,a.createElement)(c.InnerBlocks.Content,null)))},deprecated:E})},1991:(e,t)=>{var l;!function(){"use strict";var a=function(){function e(){}function t(e,t){for(var l=t.length,a=0;a<l;++a)n(e,t[a])}e.prototype=Object.create(null);var l={}.hasOwnProperty,a=/\s+/;function n(e,n){if(n){var r=typeof n;"string"===r?function(e,t){for(var l=t.split(a),n=l.length,r=0;r<n;++r)e[l[r]]=!0}(e,n):Array.isArray(n)?t(e,n):"object"===r?function(e,t){if(t.toString===Object.prototype.toString)for(var a in t)l.call(t,a)&&(e[a]=!!t[a]);else e[t.toString()]=!0}(e,n):"number"===r&&function(e,t){e[t]=!0}(e,n)}}return function(){for(var l=arguments.length,a=Array(l),n=0;n<l;n++)a[n]=arguments[n];var r=new e;t(r,a);var c=[];for(var o in r)r[o]&&c.push(o);return c.join(" ")}}();e.exports?(a.default=a,e.exports=a):void 0===(l=function(){return a}.apply(t,[]))||(e.exports=l)}()},4184:(e,t)=>{var l;!function(){"use strict";var a={}.hasOwnProperty;function n(){for(var e=[],t=0;t<arguments.length;t++){var l=arguments[t];if(l){var r=typeof l;if("string"===r||"number"===r)e.push(l);else if(Array.isArray(l)){if(l.length){var c=n.apply(null,l);c&&e.push(c)}}else if("object"===r)if(l.toString===Object.prototype.toString)for(var o in l)a.call(l,o)&&l[o]&&e.push(o);else e.push(l.toString())}}return e.join(" ")}e.exports?(n.default=n,e.exports=n):void 0===(l=function(){return n}.apply(t,[]))||(e.exports=l)}()}},t={};function l(a){var n=t[a];if(void 0!==n)return n.exports;var r=t[a]={exports:{}};return e[a](r,r.exports,l),r.exports}l.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return l.d(t,{a:t}),t},l.d=(e,t)=>{for(var a in t)l.o(t,a)&&!l.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),l(8596)})();