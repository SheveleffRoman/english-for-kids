(()=>{"use strict";const t=document.querySelector(".stats_btn");function e(t){if(t){const e=t.reduce(((t,e)=>{const{category:n,word:s}=e,o=`${n}-${s}`;return t[o]=(t[o]||0)+1,t}),{}),n={};for(const t in e){const[s,o]=t.split("-");n[s]||(n[s]={}),n[s][o]=e[t]}return console.log(n),n}return{}}function n(){localStorage.clear(),t.click()}function s(t,e){const n=Array.from(t.tBodies[0].rows),s=t.getAttribute(`data-sort-order-${e}`),o="desc"===s?1:-1;for(n.sort(((t,n)=>{const s=t.cells[e].textContent.trim(),c=n.cells[e].textContent.trim();return o*s.localeCompare(c,void 0,{numeric:!0,sensitivity:"base"})}));t.tBodies[0].firstChild;)t.tBodies[0].removeChild(t.tBodies[0].firstChild);t.tBodies[0].append(...n);const c=t.getElementsByClassName("sort-symbol");for(let t=0;t<c.length;t++)c[t].textContent="";t.querySelector(`th:nth-child(${e+1}) .sort-symbol`).textContent=1===o?"↓":"↑",t.setAttribute(`data-sort-order-${e}`,"desc"===s?"asc":"desc")}const o=document.querySelector(".start-game"),c=document.querySelector(".repeat-word"),i=document.querySelector(".stars");function r(){const t=document.querySelectorAll(".info_btn");console.log(t),t.forEach((t=>t.addEventListener("click",(e=>{e.stopPropagation();const n=t.closest(".card");!function(t){const e=[{category:t.dataset.category,word:t.dataset.word}];if(localStorage.trainedWords){let t=localStorage.getItem("trainedWords");t=JSON.parse(t),t=t.concat(e),localStorage.setItem("trainedWords",JSON.stringify(t))}else localStorage.setItem("trainedWords",JSON.stringify(e))}(n),n.classList.add("flip");const s=n.querySelector(".card_back");console.log(s);const o="ontouchstart"in window||navigator.maxTouchPoints;function c(){n.classList.remove("flip"),t.classList.remove("hidden"),o?document.removeEventListener("touchend",c):s.removeEventListener("mouseleave",c)}o?document.addEventListener("touchend",c):s.addEventListener("mouseleave",c)}))))}function a(){const t=document.querySelectorAll(".card_face");console.log(t),t.forEach((t=>{t.addEventListener("click",l)}))}function l(){const t=this.querySelector(".sound_btn").firstChild.getAttribute("data-sound");new Audio(t).play()}console.log(i);const d=document.getElementById("app_mode_input");function u(){console.log(d);const t=document.querySelectorAll(".card_face > .card_info"),e=document.querySelectorAll(".card_face");console.log(t),d.addEventListener("change",(()=>{d.checked?(t.forEach((t=>t.classList.add("play-mode"))),e.forEach((t=>t.removeEventListener("click",l)))):(t.forEach((t=>t.classList.remove("play-mode"))),e.forEach((t=>t.addEventListener("click",l))))}))}const p=[],b=[];function h(t){if(t){const t=new m("div").setAttribute("class","star").build();return i.appendChild(t),new Audio("./src/sounds/stars/right.mp3").play(),t}const e=new m("div").setAttribute("class","no-star").build();return i.appendChild(e),new Audio("./src/sounds/stars/wrong.mp3").play(),e}class m{constructor(t){this.element=document.createElement(t)}setAttribute(t,e){return this.element.setAttribute(t,e),this}text(t){return this.element.textContent=t,this}build(){return this.element}}const f=document.querySelector(".cards-container");async function g(t){try{const e=await fetch("./src/scripts/cards.json"),n=(await e.json())[t].words;console.log(n),console.log(f),f.innerHTML="",n.forEach((e=>{const n=new m("div").setAttribute("class","card_container").build(),s=new m("div").setAttribute("class","card").setAttribute("data-word",`${e.en}`).setAttribute("data-category",`${t}`).build();f.appendChild(n),n.appendChild(s);const o=new m("div").setAttribute("class","card_face").build();s.appendChild(o);const c=new m("div").setAttribute("class","card_image").build();o.appendChild(c);const i=new m("img").build();i.src=e.img,i.alt=e.en,c.appendChild(i);const r=new m("div").setAttribute("class","card_info").build();document.getElementById("app_mode_input").checked&&r.setAttribute("class","card_info play-mode"),o.appendChild(r);const a=new m("div").setAttribute("class","info_btn").build();r.appendChild(a);const l=new m("span").setAttribute("class","icon_btn info").build();a.appendChild(l);const d=new m("div").setAttribute("class","info_title").text(`${e.en}`).build();r.appendChild(d);const u=new m("div").setAttribute("class","sound_btn").build();r.appendChild(u);const p=new m("span").setAttribute("class","icon_btn").setAttribute("data-sound",`${e.sound}`).build();u.appendChild(p);const b=new m("div").setAttribute("class","card_back").build();s.appendChild(b);const h=new m("div").setAttribute("class","card_image").build();b.appendChild(h);const g=new m("img").build();h.appendChild(g),g.src=e.img,g.alt=e.en;const w=new m("div").setAttribute("class","card_info").build();b.appendChild(w);const v=new m("div").setAttribute("class","info_title").text(`${e.ru}`).build();w.appendChild(v)}))}catch(t){console.error("Error:",t)}}const w=document.querySelector("div.burger"),v=document.querySelectorAll(".menu_item"),y=document.querySelectorAll(".menu_link"),C=document.querySelectorAll(".category");function A(){v.forEach((t=>t.classList.remove("active"))),this.parentElement.classList.add("active"),w.click()}function E(){const t=this.querySelector("a").getAttribute("href"),e=document.querySelector(`.menu_link[href="${t}"]`);v.forEach((t=>t.classList.remove("active"))),e.parentElement.classList.add("active")}!function(){const t=document.querySelector("ul.menu"),e=document.querySelector("div.blackout");w.addEventListener("click",(()=>{t.classList.toggle("show"),w.classList.toggle("open"),document.body.classList.toggle("no-scroll"),e.classList.toggle("view")})),e.addEventListener("click",(()=>{w.click()}))}(),y.forEach((t=>t.addEventListener("click",A))),y.forEach((t=>t.addEventListener("click",(async()=>{const e=new URL(t.href).hash.slice(1);await g(e),f.classList.remove("table-flex"),f.classList.remove("flex-card"),d.removeAttribute("disabled"),d.nextElementSibling.classList.remove("inactive"),u(),r(),a()})))),C.forEach((t=>t.addEventListener("click",E))),document.querySelectorAll(".category").forEach((t=>t.addEventListener("click",(async()=>{const e=t.getAttribute("id");d.removeAttribute("disabled"),d.nextElementSibling.classList.remove("inactive"),console.log(e),await g(e),u(),r(),a()})))),function(){const t=document.querySelector(".play-panel"),e=document.querySelector(".stars");d.addEventListener("change",(()=>{t.classList.toggle("game"),e.classList.toggle("no-display")}))}(),C.forEach((t=>t.addEventListener("click",(()=>o.removeAttribute("disabled"))))),y.forEach((t=>t.addEventListener("click",(()=>o.removeAttribute("disabled"))))),o.addEventListener("click",(()=>{o.setAttribute("disabled","true"),c.removeAttribute("disabled")})),o.addEventListener("click",(()=>{d.addEventListener("click",(()=>{o.removeAttribute("disabled"),c.setAttribute("disabled","true")}))})),o.addEventListener("click",(async()=>{const t=await async function(t){try{const e=await fetch("./src/scripts/cards.json");let n=(await e.json())[t].words;return n=function(t){let e=t.length;for(;0!==e;){const n=Math.floor(Math.random()*e);e--,[t[e],t[n]]=[t[n],t[e]]}return t}(n),n}catch(t){console.error("Error:",t)}}(new URL(window.location.href).hash.slice(1));let e=t[0];console.log(e);let n=e.sound,s=new Audio(n);s.play(),d.addEventListener("change",(()=>{window.location.href="./index.html"})),c.addEventListener("click",(()=>function(t){if(t){const e=t.sound;new Audio(e).play()}}(e))),document.querySelectorAll(".card").forEach((o=>{o.addEventListener("click",(function(){const c=this.dataset.word,i=this.dataset.category;if(c===e.en){o.classList.add("green"),o.classList.add("non-clickable"),h(!0);const r={category:i,word:c};if(p.push(r),t.shift(),!(t.length>0))return console.log("All words have been matched."),console.log(p),console.log(b),function(){if(localStorage.correctWords||localStorage.incorrectWords){let t=localStorage.getItem("correctWords"),e=localStorage.getItem("incorrectWords");t=JSON.parse(t),e=JSON.parse(e),t=t.concat(p),e=e.concat(b),localStorage.setItem("correctWords",JSON.stringify(t)),localStorage.setItem("incorrectWords",JSON.stringify(e))}else localStorage.setItem("correctWords",JSON.stringify(p)),localStorage.setItem("incorrectWords",JSON.stringify(b))}(),setTimeout((()=>function(){const t=document.querySelector(".cards-container");t.innerHTML="";const e=new m("div").setAttribute("class","summary").build(),n=new m("h1").build(),s=new m("p").build();0===b.length?(n.textContent="Great!",s.textContent="You made 0 mistakes, congratulations!"):(n.textContent="Ooooops!",s.textContent=`You made ${b.length} errors, try again!!`),t.appendChild(e),e.appendChild(n),e.appendChild(s)}()),2e3),setTimeout((()=>window.location.href="./index.html"),7e3);e=t[0],n=e.sound,s=new Audio(n),setTimeout((()=>s.play()),500)}else{h(!1);const t={category:i,word:e.en};b.push(t)}}))}))})),t.addEventListener("click",(o=>{o.preventDefault(),d.checked&&d.click(),d.setAttribute("disabled","true"),d.nextElementSibling.classList.add("inactive"),f.innerHTML="",function(){let o=localStorage.getItem("trainedWords"),c=localStorage.getItem("correctWords"),i=localStorage.getItem("incorrectWords");o=JSON.parse(o),c=JSON.parse(c),i=JSON.parse(i);!async function(e,o,c){const i=await fetch("./src/scripts/cards.json"),l=await i.json();f.classList.add("table-flex");const d=new m("div").setAttribute("class","stats_btns").build(),u=new m("a").setAttribute("class","difficult-words").build();u.textContent="Repeat difficult words",u.addEventListener("click",(async()=>{const e=function(){const t=document.querySelectorAll("tbody tr");let e=[];t.forEach((t=>{const n=t.querySelectorAll("td"),s=n[n.length-1],o=parseInt(s.innerText||s.textContent);!isNaN(o)&&0!==o&&o<=25&&e.push(t)})),e.length>8&&(e.sort((()=>.5-Math.random())),e=e.slice(0,8));const n=[];return e.forEach((t=>{const e=t.getElementsByTagName("td"),s=e[0].textContent,o=e[1].textContent;n.push({category:s,word:o})})),n}();if(console.log(e),f.innerHTML="",f.classList.remove("table-flex"),0!==e.length){f.classList.add("flex-card");const t=e.map((t=>async function(t,e){try{const n=await fetch("./src/scripts/cards.json");return(await n.json())[t].words.filter((t=>t.en===e))}catch(t){return[]}}(t.category,t.word))),n=(await Promise.all(t)).flat();console.log(n),async function(t){try{t.forEach((t=>{const e=new m("div").setAttribute("class","card_container").build(),n=new m("div").setAttribute("class","card").setAttribute("data-word",`${t.en}`).setAttribute("data-category",`${s=t.img,s.split("/")[4]}`).build();var s;f.appendChild(e),e.appendChild(n);const o=new m("div").setAttribute("class","card_face").build();n.appendChild(o);const c=new m("div").setAttribute("class","card_image").build();o.appendChild(c);const i=new m("img").build();i.src=t.img,i.alt=t.en,c.appendChild(i);const r=new m("div").setAttribute("class","card_info").build();document.getElementById("app_mode_input").checked&&r.setAttribute("class","card_info play-mode"),o.appendChild(r);const a=new m("div").setAttribute("class","info_btn").build();r.appendChild(a);const l=new m("span").setAttribute("class","icon_btn info").build();a.appendChild(l);const d=new m("div").setAttribute("class","info_title").text(`${t.en}`).build();r.appendChild(d);const u=new m("div").setAttribute("class","sound_btn").build();r.appendChild(u);const p=new m("span").setAttribute("class","icon_btn").setAttribute("data-sound",`${t.sound}`).build();u.appendChild(p);const b=new m("div").setAttribute("class","card_back").build();n.appendChild(b);const h=new m("div").setAttribute("class","card_image").build();b.appendChild(h);const g=new m("img").build();h.appendChild(g),g.src=t.img,g.alt=t.en;const w=new m("div").setAttribute("class","card_info").build();b.appendChild(w);const v=new m("div").setAttribute("class","info_title").text(`${t.ru}`).build();w.appendChild(v)}))}catch(t){console.error("Error:",t)}}(n),a(),r()}else!function(){f.innerHTML="";const t=new m("div").setAttribute("class","summary").build(),e=new m("h1").build(),n=new m("p").build();e.textContent="Great!",n.textContent="You have no difficulty with words!",f.appendChild(t),t.appendChild(e),t.appendChild(n)}(),setTimeout((()=>{t.click()}),3e3)}));const p=new m("button").setAttribute("class","reset-stat").build();p.textContent="Reset",f.appendChild(d),d.appendChild(u),d.appendChild(p),p.addEventListener("click",n);const b=new m("div").setAttribute("class","table-overflow").build(),h=new m("table").setAttribute("class","stat-table").build(),g=new m("thead").build(),w=new m("tbody").build();f.appendChild(b),b.appendChild(h),h.appendChild(g),h.appendChild(w),g.innerHTML='\n    <th class="sortable">Categories<span class="sort-symbol"></span></th>\n    <th class="sortable">Words<span class="sort-symbol"></span></th>\n    <th class="sortable">Translation<span class="sort-symbol"></span></th>\n    <th class="sortable">Trained<span class="sort-symbol"></span></th>\n    <th class="sortable">Correct<span class="sort-symbol"></span></th>\n    <th class="sortable">Incorrect<span class="sort-symbol"></span></th>\n    <th class="sortable">%<span class="sort-symbol"></span></th>\n    ',console.log(l);for(const t in l)l[t].words.forEach((n=>{const s=new m("tr").build();w.appendChild(s);const i=new m("td").build();i.textContent=t;const r=new m("td").build();r.textContent=n.en;const a=new m("td").build();a.textContent=n.ru;const l=n.en,d=new m("td").build(),u=new m("td").build(),p=new m("td").build(),b=new m("td").build();if(e[t]&&e[t][l]?d.textContent=e[t][l]:d.textContent="0",o[t]&&0!==o.length?u.textContent=o[t][l]:u.textContent="0",c[t]&&c[t][l]?p.textContent=c[t][l]:p.textContent="0","0"===u.textContent&&"0"===p.textContent)b.textContent="0";else{const t=parseInt(u.textContent)/(parseInt(u.textContent)+parseInt(p.textContent))*100;b.textContent=t.toFixed(0)}s.appendChild(i),s.appendChild(r),s.appendChild(a),s.appendChild(d),s.appendChild(u),s.appendChild(p),s.appendChild(b)}));const v=document.querySelectorAll(".sortable");for(let t=0;t<v.length;t++){const e=v[t].closest("table"),n=Array.from(v[t].parentNode.cells).indexOf(v[t]);n<3?e.setAttribute(`data-sort-order-${n}`,"desc"):e.setAttribute(`data-sort-order-${n}`,"asc"),v[t].addEventListener("click",(function(){const t=Array.from(this.parentNode.cells).indexOf(this);s(e,t)}))}}(e(o),e(c),e(i))}()}))})();