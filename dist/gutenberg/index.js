(()=>{"use strict";const e=window.wp.element,t=window.wp.i18n,r=t=>{let{currentPostLink:r,linkText:n}=t;return(0,e.createElement)(e.Fragment,null,(0,e.createElement)("a",{href:r,target:"_blank",rel:"noopener noreferrer"},n))};wp.domReady((function(){window.arkbSettings.disableHeaderLink||setTimeout((()=>{const n=document.querySelector(".edit-post-header__toolbar");if(null===n)return;const o=wp.data.select("core/editor").getCurrentPost();if(!o)return;const a=o.link;if(!a)return;const i=wp.data.select("core/editor").getCurrentPostType();let c="";if("post"===i)c=(0,t.__)("View Post","arkhe-blocks");else{if("page"!==i)return!1;c=(0,t.__)("View Page","arkhe-blocks")}n.insertAdjacentHTML("beforeend",'<div class="ark-custom-header-toolbar"></div>'),(0,e.render)((0,e.createElement)(r,{currentPostLink:a,linkText:c}),document.querySelector(".ark-custom-header-toolbar"))}),20)}));const n=(0,e.createContext)();window.arkbContext={SliderContext:n}})();