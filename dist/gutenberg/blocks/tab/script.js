document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll(".arkb-tabList__button").forEach((t=>{t.addEventListener("click",(function(t){!function(t){t.preventDefault();const e=0===t.clientX,r=t.currentTarget,a="true"===r.getAttribute("aria-selected");if(e||r.blur(),a)return;const n=r.getAttribute("aria-controls"),i=document.getElementById(n);if(null===i)return;const u=r.closest('[role="tablist"]').querySelector('.arkb-tabList__item [aria-selected="true"]'),c=i.parentNode.querySelector('.arkb-tabBody__content[aria-hidden="false"]');r.setAttribute("aria-selected","true"),u.setAttribute("aria-selected","false"),i.setAttribute("aria-hidden","false"),c.setAttribute("aria-hidden","true")}(t)}))}))}));