import{c as D,D as J,A as j,Q as q,q as M,n as L,a as It,d as u,o as H,R as B,h as U,V as Ut,_ as Fn,U as ue,O as Vn,C as ee,r as Y,j as ye,X as je,m as Be,M as En,$ as Rn,a0 as Sn,a1 as Hn,y as Tn,w as Ue,a2 as Kn,a3 as Gn,a4 as Qn,e as zt,i as _n,a5 as At}from"./core-DcDs-ehl.js";import{n as h,r as W,c as N,o as O,U as se,i as Jn,t as Yn,b as Xn,a as Zn}from"./index-4EO0NBhg.js";import{g as ei}from"./_commonjsHelpers-CE1G-McA.js";import{r as ti}from"./dijkstra-COg3n3zL.js";import"./index-Dp-_haKX.js";import"./index-DaS599h5.js";var Te=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let fe=class extends D{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=J.state.connectors,this.count=j.state.count,this.filteredCount=j.state.filteredWallets.length,this.isFetchingRecommendedWallets=j.state.isFetchingRecommendedWallets,this.unsubscribe.push(J.subscribeKey("connectors",t=>this.connectors=t),j.subscribeKey("count",t=>this.count=t),j.subscribeKey("filteredWallets",t=>this.filteredCount=t.length),j.subscribeKey("isFetchingRecommendedWallets",t=>this.isFetchingRecommendedWallets=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){const t=this.connectors.find(c=>c.id==="walletConnect"),{allWallets:i}=q.state;if(!t||i==="HIDE"||i==="ONLY_MOBILE"&&!M.isMobile())return null;const r=j.state.featured.length,o=this.count+r,n=o<10?o:Math.floor(o/10)*10,s=this.filteredCount>0?this.filteredCount:n;let a=`${s}`;this.filteredCount>0?a=`${this.filteredCount}`:s<o&&(a=`${s}+`);const l=L.hasAnyConnection(It.CONNECTOR_ID.WALLET_CONNECT);return u`
      <wui-list-wallet
        name="Search Wallet"
        walletIcon="search"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${a}
        tagVariant="info"
        data-testid="all-wallets"
        tabIdx=${O(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        ?disabled=${l}
        size="sm"
      ></wui-list-wallet>
    `}onAllWallets(){H.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),B.push("AllWallets",{redirectView:B.state.data?.redirectView})}};Te([h()],fe.prototype,"tabIdx",void 0);Te([W()],fe.prototype,"connectors",void 0);Te([W()],fe.prototype,"count",void 0);Te([W()],fe.prototype,"filteredCount",void 0);Te([W()],fe.prototype,"isFetchingRecommendedWallets",void 0);fe=Te([N("w3m-all-wallets-widget")],fe);const ni=U`
  :host {
    margin-top: ${({spacing:e})=>e[1]};
  }
  wui-separator {
    margin: ${({spacing:e})=>e[3]} calc(${({spacing:e})=>e[3]} * -1)
      ${({spacing:e})=>e[2]} calc(${({spacing:e})=>e[3]} * -1);
    width: calc(100% + ${({spacing:e})=>e[3]} * 2);
  }
`;var _e=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let de=class extends D{constructor(){super(),this.unsubscribe=[],this.explorerWallets=j.state.explorerWallets,this.connections=L.state.connections,this.connectorImages=Ut.state.connectorImages,this.loadingTelegram=!1,this.unsubscribe.push(L.subscribeKey("connections",t=>this.connections=t),Ut.subscribeKey("connectorImages",t=>this.connectorImages=t),j.subscribeKey("explorerFilteredWallets",t=>{this.explorerWallets=t?.length?t:j.state.explorerWallets}),j.subscribeKey("explorerWallets",t=>{this.explorerWallets?.length||(this.explorerWallets=t)})),M.isTelegram()&&M.isIos()&&(this.loadingTelegram=!L.state.wcUri,this.unsubscribe.push(L.subscribeKey("wcUri",t=>this.loadingTelegram=!t)))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return u`
      <wui-flex flexDirection="column" gap="2"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){return Fn.connectorList().map((t,i)=>t.kind==="connector"?this.renderConnector(t,i):this.renderWallet(t,i))}getConnectorNamespaces(t){return t.subtype==="walletConnect"?[]:t.subtype==="multiChain"?t.connector.connectors?.map(i=>i.chain)||[]:[t.connector.chain]}renderConnector(t,i){const r=t.connector,o=ue.getConnectorImage(r)||this.connectorImages[r?.imageId??""],s=(this.connections.get(r.chain)??[]).some(E=>Vn.isLowerCaseMatch(E.connectorId,r.id));let a,l;t.subtype==="walletConnect"?(a="qr code",l="accent"):t.subtype==="injected"||t.subtype==="announced"?(a=s?"connected":"installed",l=s?"info":"success"):(a=void 0,l=void 0);const c=L.hasAnyConnection(It.CONNECTOR_ID.WALLET_CONNECT),w=t.subtype==="walletConnect"||t.subtype==="external"?c:!1;return u`
      <w3m-list-wallet
        displayIndex=${i}
        imageSrc=${O(o)}
        .installed=${!0}
        name=${r.name??"Unknown"}
        .tagVariant=${l}
        tagLabel=${O(a)}
        data-testid=${`wallet-selector-${r.id.toLowerCase()}`}
        size="sm"
        @click=${()=>this.onClickConnector(t)}
        tabIdx=${O(this.tabIdx)}
        ?disabled=${w}
        rdnsId=${O(r.explorerWallet?.rdns||void 0)}
        walletRank=${O(r.explorerWallet?.order)}
        .namespaces=${this.getConnectorNamespaces(t)}
      >
      </w3m-list-wallet>
    `}onClickConnector(t){const i=B.state.data?.redirectView;if(t.subtype==="walletConnect"){J.setActiveConnector(t.connector),M.isMobile()?B.push("AllWallets"):B.push("ConnectingWalletConnect",{redirectView:i});return}if(t.subtype==="multiChain"){J.setActiveConnector(t.connector),B.push("ConnectingMultiChain",{redirectView:i});return}if(t.subtype==="injected"){J.setActiveConnector(t.connector),B.push("ConnectingExternal",{connector:t.connector,redirectView:i,wallet:t.connector.explorerWallet});return}if(t.subtype==="announced"){if(t.connector.id==="walletConnect"){M.isMobile()?B.push("AllWallets"):B.push("ConnectingWalletConnect",{redirectView:i});return}B.push("ConnectingExternal",{connector:t.connector,redirectView:i,wallet:t.connector.explorerWallet});return}B.push("ConnectingExternal",{connector:t.connector,redirectView:i})}renderWallet(t,i){const r=t.wallet,o=ue.getWalletImage(r),s=L.hasAnyConnection(It.CONNECTOR_ID.WALLET_CONNECT),a=this.loadingTelegram,l=t.subtype==="recent"?"recent":void 0,c=t.subtype==="recent"?"info":void 0;return u`
      <w3m-list-wallet
        displayIndex=${i}
        imageSrc=${O(o)}
        name=${r.name??"Unknown"}
        @click=${()=>this.onClickWallet(t)}
        size="sm"
        data-testid=${`wallet-selector-${r.id}`}
        tabIdx=${O(this.tabIdx)}
        ?loading=${a}
        ?disabled=${s}
        rdnsId=${O(r.rdns||void 0)}
        walletRank=${O(r.order)}
        tagLabel=${O(l)}
        .tagVariant=${c}
      >
      </w3m-list-wallet>
    `}onClickWallet(t){const i=B.state.data?.redirectView,r=ee.state.activeChain;if(t.subtype==="featured"){J.selectWalletConnector(t.wallet);return}if(t.subtype==="recent"){if(this.loadingTelegram)return;J.selectWalletConnector(t.wallet);return}if(t.subtype==="custom"){if(this.loadingTelegram)return;B.push("ConnectingWalletConnect",{wallet:t.wallet,redirectView:i});return}if(this.loadingTelegram)return;const o=r?J.getConnector({id:t.wallet.id,namespace:r}):void 0;o?B.push("ConnectingExternal",{connector:o,redirectView:i}):B.push("ConnectingWalletConnect",{wallet:t.wallet,redirectView:i})}};de.styles=ni;_e([h({type:Number})],de.prototype,"tabIdx",void 0);_e([W()],de.prototype,"explorerWallets",void 0);_e([W()],de.prototype,"connections",void 0);_e([W()],de.prototype,"connectorImages",void 0);_e([W()],de.prototype,"loadingTelegram",void 0);de=_e([N("w3m-connector-list")],de);const ii=U`
  :host {
    flex: 1;
    height: 100%;
  }

  button {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    column-gap: ${({spacing:e})=>e[1]};
    color: ${({tokens:e})=>e.theme.textSecondary};
    border-radius: ${({borderRadius:e})=>e[20]};
    background-color: transparent;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-active='true'] {
    color: ${({tokens:e})=>e.theme.textPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundTertiary};
  }

  button:hover:enabled:not([data-active='true']),
  button:active:enabled:not([data-active='true']) {
    wui-text,
    wui-icon {
      color: ${({tokens:e})=>e.theme.textPrimary};
    }
  }
`;var Le=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};const ri={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},oi={lg:"md",md:"sm",sm:"sm"};let pe=class extends D{constructor(){super(...arguments),this.icon="mobile",this.size="md",this.label="",this.active=!1}render(){return u`
      <button data-active=${this.active}>
        ${this.icon?u`<wui-icon size=${oi[this.size]} name=${this.icon}></wui-icon>`:""}
        <wui-text variant=${ri[this.size]}> ${this.label} </wui-text>
      </button>
    `}};pe.styles=[Y,ye,ii];Le([h()],pe.prototype,"icon",void 0);Le([h()],pe.prototype,"size",void 0);Le([h()],pe.prototype,"label",void 0);Le([h({type:Boolean})],pe.prototype,"active",void 0);pe=Le([N("wui-tab-item")],pe);const si=U`
  :host {
    display: inline-flex;
    align-items: center;
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[32]};
    padding: ${({spacing:e})=>e["01"]};
    box-sizing: border-box;
  }

  :host([data-size='sm']) {
    height: 26px;
  }

  :host([data-size='md']) {
    height: 36px;
  }
`;var ke=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let ge=class extends D{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.size="md",this.activeTab=0}render(){return this.dataset.size=this.size,this.tabs.map((t,i)=>{const r=i===this.activeTab;return u`
        <wui-tab-item
          @click=${()=>this.onTabClick(i)}
          icon=${t.icon}
          size=${this.size}
          label=${t.label}
          ?active=${r}
          data-active=${r}
          data-testid="tab-${t.label?.toLowerCase()}"
        ></wui-tab-item>
      `})}onTabClick(t){this.activeTab=t,this.onTabChange(t)}};ge.styles=[Y,ye,si];ke([h({type:Array})],ge.prototype,"tabs",void 0);ke([h()],ge.prototype,"onTabChange",void 0);ke([h()],ge.prototype,"size",void 0);ke([W()],ge.prototype,"activeTab",void 0);ge=ke([N("wui-tabs")],ge);var Pt=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let ze=class extends D{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(t=>t())}render(){const t=this.generateTabs();return u`
      <wui-flex justifyContent="center" .padding=${["0","0","4","0"]}>
        <wui-tabs .tabs=${t} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){const t=this.platforms.map(i=>i==="browser"?{label:"Browser",icon:"extension",platform:"browser"}:i==="mobile"?{label:"Mobile",icon:"mobile",platform:"mobile"}:i==="qrcode"?{label:"Mobile",icon:"mobile",platform:"qrcode"}:i==="web"?{label:"Webapp",icon:"browser",platform:"web"}:i==="desktop"?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"});return this.platformTabs=t.map(({platform:i})=>i),t}onTabChange(t){const i=this.platformTabs[t];i&&this.onSelectPlatfrom?.(i)}};Pt([h({type:Array})],ze.prototype,"platforms",void 0);Pt([h()],ze.prototype,"onSelectPlatfrom",void 0);ze=Pt([N("w3m-connecting-header")],ze);const ai=U`
  :host {
    display: block;
    width: 100px;
    height: 100px;
  }

  svg {
    width: 100px;
    height: 100px;
  }

  rect {
    fill: none;
    stroke: ${e=>e.colors.accent100};
    stroke-width: 3px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var In=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let qe=class extends D{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){const t=this.radius>50?50:this.radius,r=36-t,o=116+r,n=245+r,s=360+r*1.75;return u`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${t}
          stroke-dasharray="${o} ${n}"
          stroke-dashoffset=${s}
        />
      </svg>
    `}};qe.styles=[Y,ai];In([h({type:Number})],qe.prototype,"radius",void 0);qe=In([N("wui-loading-thumbnail")],qe);const li=U`
  wui-flex {
    width: 100%;
    height: 52px;
    box-sizing: border-box;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding-left: ${({spacing:e})=>e[3]};
    padding-right: ${({spacing:e})=>e[3]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[6]};
  }

  wui-text {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  wui-icon {
    width: 12px;
    height: 12px;
  }
`;var Xe=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let Re=class extends D{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return u`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="inherit">${this.label}</wui-text>
        <wui-button variant="accent-secondary" size="sm">
          ${this.buttonLabel}
          <wui-icon name="chevronRight" color="inherit" size="inherit" slot="iconRight"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};Re.styles=[Y,ye,li];Xe([h({type:Boolean})],Re.prototype,"disabled",void 0);Xe([h()],Re.prototype,"label",void 0);Xe([h()],Re.prototype,"buttonLabel",void 0);Re=Xe([N("wui-cta-button")],Re);const ci=U`
  :host {
    display: block;
    padding: 0 ${({spacing:e})=>e[5]} ${({spacing:e})=>e[5]};
  }
`;var An=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let Fe=class extends D{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;const{name:t,app_store:i,play_store:r,chrome_store:o,homepage:n}=this.wallet,s=M.isMobile(),a=M.isIos(),l=M.isAndroid(),c=[i,r,n,o].filter(Boolean).length>1,w=se.getTruncateString({string:t,charsStart:12,charsEnd:0,truncate:"end"});return c&&!s?u`
        <wui-cta-button
          label=${`Don't have ${w}?`}
          buttonLabel="Get"
          @click=${()=>B.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!c&&n?u`
        <wui-cta-button
          label=${`Don't have ${w}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:i&&a?u`
        <wui-cta-button
          label=${`Don't have ${w}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:r&&l?u`
        <wui-cta-button
          label=${`Don't have ${w}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&M.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&M.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&M.openHref(this.wallet.homepage,"_blank")}};Fe.styles=[ci];An([h({type:Object})],Fe.prototype,"wallet",void 0);Fe=An([N("w3m-mobile-download-links")],Fe);const ui=U`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-wallet-image {
    width: 56px;
    height: 56px;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e[1]} * -1);
    bottom: calc(${({spacing:e})=>e[1]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: ${({durations:e})=>e.lg};
    transition-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:e})=>e[4]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:e})=>e["ease-out-power-2"]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  w3m-mobile-download-links {
    padding: 0px;
    width: 100%;
  }
`;var X=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};class z extends D{constructor(){super(),this.wallet=B.state.data?.wallet,this.connector=B.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=ue.getConnectorImage(this.connector)??ue.getWalletImage(this.wallet),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=L.state.wcUri,this.error=L.state.wcError,this.ready=!1,this.showRetry=!1,this.label=void 0,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(L.subscribeKey("wcUri",t=>{this.uri=t,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),L.subscribeKey("wcError",t=>this.error=t)),(M.isTelegram()||M.isSafari())&&M.isIos()&&L.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),L.setWcError(!1),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();const t=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel;let i="";return this.label?i=this.label:(i=`Continue in ${this.name}`,this.error&&(i="Connection declined")),u`
      <wui-flex
        data-error=${O(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="6"
      >
        <wui-flex gap="2" justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${O(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            color="error"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="6"> <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["2","0","0","0"]}
        >
          <wui-text align="center" variant="lg-medium" color=${this.error?"error":"primary"}>
            ${i}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary">${t}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?u`
                <wui-button
                  variant="neutral-secondary"
                  size="md"
                  ?disabled=${this.isRetrying||this.isLoading}
                  @click=${this.onTryAgain.bind(this)}
                  data-testid="w3m-connecting-widget-secondary-button"
                >
                  <wui-icon
                    color="inherit"
                    slot="iconLeft"
                    name=${this.secondaryBtnIcon}
                  ></wui-icon>
                  ${this.secondaryBtnLabel}
                </wui-button>
              `:null}
      </wui-flex>

      ${this.isWalletConnect?u`
              <wui-flex .padding=${["0","5","5","5"]} justifyContent="center">
                <wui-link
                  @click=${this.onCopyUri}
                  variant="secondary"
                  icon="copy"
                  data-testid="wui-link-copy"
                >
                  Copy link
                </wui-link>
              </wui-flex>
            `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links></wui-flex>
      </wui-flex>
    `}onShowRetry(){this.error&&!this.showRetry&&(this.showRetry=!0,this.shadowRoot?.querySelector("wui-button")?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"}))}onTryAgain(){L.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.()}loaderTemplate(){const t=je.state.themeVariables["--w3m-border-radius-master"],i=t?parseInt(t.replace("px",""),10):4;return u`<wui-loading-thumbnail radius=${i*9}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(M.copyToClopboard(this.uri),Be.showSuccess("Link copied"))}catch{Be.showError("Failed to copy")}}}z.styles=ui;X([W()],z.prototype,"isRetrying",void 0);X([W()],z.prototype,"uri",void 0);X([W()],z.prototype,"error",void 0);X([W()],z.prototype,"ready",void 0);X([W()],z.prototype,"showRetry",void 0);X([W()],z.prototype,"label",void 0);X([W()],z.prototype,"secondaryBtnLabel",void 0);X([W()],z.prototype,"secondaryLabel",void 0);X([W()],z.prototype,"isLoading",void 0);X([h({type:Boolean})],z.prototype,"isMobile",void 0);X([h()],z.prototype,"onRetry",void 0);var di=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let qt=class extends z{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),H.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:B.state.view}})}async onConnectProxy(){try{this.error=!1;const{connectors:t}=J.state,i=t.find(r=>r.type==="ANNOUNCED"&&r.info?.rdns===this.wallet?.rdns||r.type==="INJECTED"||r.name===this.wallet?.name);if(i)await L.connectExternal(i,i.chain);else throw new Error("w3m-connecting-wc-browser: No connector found");En.close()}catch(t){t instanceof Rn&&t.originalName===Sn.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?H.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:t.message}}):H.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:t?.message??"Unknown"}}),this.error=!0}}};qt=di([N("w3m-connecting-wc-browser")],qt);var hi=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let Ft=class extends z{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),H.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:B.state.view}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;const{desktop_link:t,name:i}=this.wallet,{redirect:r,href:o}=M.formatNativeUrl(t,this.uri);L.setWcLinking({name:i,href:o}),L.setRecentWallet(this.wallet),M.openHref(r,"_blank")}catch{this.error=!0}}};Ft=hi([N("w3m-connecting-wc-desktop")],Ft);var Ie=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let we=class extends z{constructor(){if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=q.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{Hn.onConnectMobile(this.wallet)},!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=Tn.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(L.subscribeKey("wcUri",()=>{this.onHandleURI()})),H.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:B.state.view}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onTryAgain(){L.setWcError(!1),this.onConnect?.()}};Ie([W()],we.prototype,"redirectDeeplink",void 0);Ie([W()],we.prototype,"redirectUniversalLink",void 0);Ie([W()],we.prototype,"target",void 0);Ie([W()],we.prototype,"preferUniversalLinks",void 0);Ie([W()],we.prototype,"isLoading",void 0);we=Ie([N("w3m-connecting-wc-mobile")],we);var Ee={},rt,Vt;function fi(){return Vt||(Vt=1,rt=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}),rt}var ot={},ce={},Ht;function $e(){if(Ht)return ce;Ht=1;let e;const t=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];return ce.getSymbolSize=function(r){if(!r)throw new Error('"version" cannot be null or undefined');if(r<1||r>40)throw new Error('"version" should be in range from 1 to 40');return r*4+17},ce.getSymbolTotalCodewords=function(r){return t[r]},ce.getBCHDigit=function(i){let r=0;for(;i!==0;)r++,i>>>=1;return r},ce.setToSJISFunction=function(r){if(typeof r!="function")throw new Error('"toSJISFunc" is not a valid function.');e=r},ce.isKanjiModeEnabled=function(){return typeof e<"u"},ce.toSJIS=function(r){return e(r)},ce}var st={},Kt;function Bt(){return Kt||(Kt=1,(function(e){e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(i){if(typeof i!="string")throw new Error("Param is not a string");switch(i.toLowerCase()){case"l":case"low":return e.L;case"m":case"medium":return e.M;case"q":case"quartile":return e.Q;case"h":case"high":return e.H;default:throw new Error("Unknown EC Level: "+i)}}e.isValid=function(r){return r&&typeof r.bit<"u"&&r.bit>=0&&r.bit<4},e.from=function(r,o){if(e.isValid(r))return r;try{return t(r)}catch{return o}}})(st)),st}var at,Gt;function pi(){if(Gt)return at;Gt=1;function e(){this.buffer=[],this.length=0}return e.prototype={get:function(t){const i=Math.floor(t/8);return(this.buffer[i]>>>7-t%8&1)===1},put:function(t,i){for(let r=0;r<i;r++)this.putBit((t>>>i-r-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(t){const i=Math.floor(this.length/8);this.buffer.length<=i&&this.buffer.push(0),t&&(this.buffer[i]|=128>>>this.length%8),this.length++}},at=e,at}var lt,Qt;function gi(){if(Qt)return lt;Qt=1;function e(t){if(!t||t<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}return e.prototype.set=function(t,i,r,o){const n=t*this.size+i;this.data[n]=r,o&&(this.reservedBit[n]=!0)},e.prototype.get=function(t,i){return this.data[t*this.size+i]},e.prototype.xor=function(t,i,r){this.data[t*this.size+i]^=r},e.prototype.isReserved=function(t,i){return this.reservedBit[t*this.size+i]},lt=e,lt}var ct={},Jt;function wi(){return Jt||(Jt=1,(function(e){const t=$e().getSymbolSize;e.getRowColCoords=function(r){if(r===1)return[];const o=Math.floor(r/7)+2,n=t(r),s=n===145?26:Math.ceil((n-13)/(2*o-2))*2,a=[n-7];for(let l=1;l<o-1;l++)a[l]=a[l-1]-s;return a.push(6),a.reverse()},e.getPositions=function(r){const o=[],n=e.getRowColCoords(r),s=n.length;for(let a=0;a<s;a++)for(let l=0;l<s;l++)a===0&&l===0||a===0&&l===s-1||a===s-1&&l===0||o.push([n[a],n[l]]);return o}})(ct)),ct}var ut={},Yt;function mi(){if(Yt)return ut;Yt=1;const e=$e().getSymbolSize,t=7;return ut.getPositions=function(r){const o=e(r);return[[0,0],[o-t,0],[0,o-t]]},ut}var dt={},Xt;function bi(){return Xt||(Xt=1,(function(e){e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(o){return o!=null&&o!==""&&!isNaN(o)&&o>=0&&o<=7},e.from=function(o){return e.isValid(o)?parseInt(o,10):void 0},e.getPenaltyN1=function(o){const n=o.size;let s=0,a=0,l=0,c=null,w=null;for(let E=0;E<n;E++){a=l=0,c=w=null;for(let v=0;v<n;v++){let p=o.get(E,v);p===c?a++:(a>=5&&(s+=t.N1+(a-5)),c=p,a=1),p=o.get(v,E),p===w?l++:(l>=5&&(s+=t.N1+(l-5)),w=p,l=1)}a>=5&&(s+=t.N1+(a-5)),l>=5&&(s+=t.N1+(l-5))}return s},e.getPenaltyN2=function(o){const n=o.size;let s=0;for(let a=0;a<n-1;a++)for(let l=0;l<n-1;l++){const c=o.get(a,l)+o.get(a,l+1)+o.get(a+1,l)+o.get(a+1,l+1);(c===4||c===0)&&s++}return s*t.N2},e.getPenaltyN3=function(o){const n=o.size;let s=0,a=0,l=0;for(let c=0;c<n;c++){a=l=0;for(let w=0;w<n;w++)a=a<<1&2047|o.get(c,w),w>=10&&(a===1488||a===93)&&s++,l=l<<1&2047|o.get(w,c),w>=10&&(l===1488||l===93)&&s++}return s*t.N3},e.getPenaltyN4=function(o){let n=0;const s=o.data.length;for(let l=0;l<s;l++)n+=o.data[l];return Math.abs(Math.ceil(n*100/s/5)-10)*t.N4};function i(r,o,n){switch(r){case e.Patterns.PATTERN000:return(o+n)%2===0;case e.Patterns.PATTERN001:return o%2===0;case e.Patterns.PATTERN010:return n%3===0;case e.Patterns.PATTERN011:return(o+n)%3===0;case e.Patterns.PATTERN100:return(Math.floor(o/2)+Math.floor(n/3))%2===0;case e.Patterns.PATTERN101:return o*n%2+o*n%3===0;case e.Patterns.PATTERN110:return(o*n%2+o*n%3)%2===0;case e.Patterns.PATTERN111:return(o*n%3+(o+n)%2)%2===0;default:throw new Error("bad maskPattern:"+r)}}e.applyMask=function(o,n){const s=n.size;for(let a=0;a<s;a++)for(let l=0;l<s;l++)n.isReserved(l,a)||n.xor(l,a,i(o,l,a))},e.getBestMask=function(o,n){const s=Object.keys(e.Patterns).length;let a=0,l=1/0;for(let c=0;c<s;c++){n(c),e.applyMask(c,o);const w=e.getPenaltyN1(o)+e.getPenaltyN2(o)+e.getPenaltyN3(o)+e.getPenaltyN4(o);e.applyMask(c,o),w<l&&(l=w,a=c)}return a}})(dt)),dt}var Oe={},Zt;function Wn(){if(Zt)return Oe;Zt=1;const e=Bt(),t=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],i=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];return Oe.getBlocksCount=function(o,n){switch(n){case e.L:return t[(o-1)*4+0];case e.M:return t[(o-1)*4+1];case e.Q:return t[(o-1)*4+2];case e.H:return t[(o-1)*4+3];default:return}},Oe.getTotalCodewordsCount=function(o,n){switch(n){case e.L:return i[(o-1)*4+0];case e.M:return i[(o-1)*4+1];case e.Q:return i[(o-1)*4+2];case e.H:return i[(o-1)*4+3];default:return}},Oe}var ht={},We={},en;function yi(){if(en)return We;en=1;const e=new Uint8Array(512),t=new Uint8Array(256);return(function(){let r=1;for(let o=0;o<255;o++)e[o]=r,t[r]=o,r<<=1,r&256&&(r^=285);for(let o=255;o<512;o++)e[o]=e[o-255]})(),We.log=function(r){if(r<1)throw new Error("log("+r+")");return t[r]},We.exp=function(r){return e[r]},We.mul=function(r,o){return r===0||o===0?0:e[t[r]+t[o]]},We}var tn;function $i(){return tn||(tn=1,(function(e){const t=yi();e.mul=function(r,o){const n=new Uint8Array(r.length+o.length-1);for(let s=0;s<r.length;s++)for(let a=0;a<o.length;a++)n[s+a]^=t.mul(r[s],o[a]);return n},e.mod=function(r,o){let n=new Uint8Array(r);for(;n.length-o.length>=0;){const s=n[0];for(let l=0;l<o.length;l++)n[l]^=t.mul(o[l],s);let a=0;for(;a<n.length&&n[a]===0;)a++;n=n.slice(a)}return n},e.generateECPolynomial=function(r){let o=new Uint8Array([1]);for(let n=0;n<r;n++)o=e.mul(o,new Uint8Array([1,t.exp(n)]));return o}})(ht)),ht}var ft,nn;function vi(){if(nn)return ft;nn=1;const e=$i();function t(i){this.genPoly=void 0,this.degree=i,this.degree&&this.initialize(this.degree)}return t.prototype.initialize=function(r){this.degree=r,this.genPoly=e.generateECPolynomial(this.degree)},t.prototype.encode=function(r){if(!this.genPoly)throw new Error("Encoder not initialized");const o=new Uint8Array(r.length+this.degree);o.set(r);const n=e.mod(o,this.genPoly),s=this.degree-n.length;if(s>0){const a=new Uint8Array(this.degree);return a.set(n,s),a}return n},ft=t,ft}var pt={},gt={},wt={},rn;function Pn(){return rn||(rn=1,wt.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40}),wt}var Z={},on;function Bn(){if(on)return Z;on=1;const e="[0-9]+",t="[A-Z $%*+\\-./:]+";let i="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";i=i.replace(/u/g,"\\u");const r="(?:(?![A-Z0-9 $%*+\\-./:]|"+i+`)(?:.|[\r
]))+`;Z.KANJI=new RegExp(i,"g"),Z.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),Z.BYTE=new RegExp(r,"g"),Z.NUMERIC=new RegExp(e,"g"),Z.ALPHANUMERIC=new RegExp(t,"g");const o=new RegExp("^"+i+"$"),n=new RegExp("^"+e+"$"),s=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");return Z.testKanji=function(l){return o.test(l)},Z.testNumeric=function(l){return n.test(l)},Z.testAlphanumeric=function(l){return s.test(l)},Z}var sn;function ve(){return sn||(sn=1,(function(e){const t=Pn(),i=Bn();e.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},e.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},e.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},e.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(n,s){if(!n.ccBits)throw new Error("Invalid mode: "+n);if(!t.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?n.ccBits[0]:s<27?n.ccBits[1]:n.ccBits[2]},e.getBestModeForData=function(n){return i.testNumeric(n)?e.NUMERIC:i.testAlphanumeric(n)?e.ALPHANUMERIC:i.testKanji(n)?e.KANJI:e.BYTE},e.toString=function(n){if(n&&n.id)return n.id;throw new Error("Invalid mode")},e.isValid=function(n){return n&&n.bit&&n.ccBits};function r(o){if(typeof o!="string")throw new Error("Param is not a string");switch(o.toLowerCase()){case"numeric":return e.NUMERIC;case"alphanumeric":return e.ALPHANUMERIC;case"kanji":return e.KANJI;case"byte":return e.BYTE;default:throw new Error("Unknown mode: "+o)}}e.from=function(n,s){if(e.isValid(n))return n;try{return r(n)}catch{return s}}})(gt)),gt}var an;function Ci(){return an||(an=1,(function(e){const t=$e(),i=Wn(),r=Bt(),o=ve(),n=Pn(),s=7973,a=t.getBCHDigit(s);function l(v,p,A){for(let m=1;m<=40;m++)if(p<=e.getCapacity(m,A,v))return m}function c(v,p){return o.getCharCountIndicator(v,p)+4}function w(v,p){let A=0;return v.forEach(function(m){const _=c(m.mode,p);A+=_+m.getBitsLength()}),A}function E(v,p){for(let A=1;A<=40;A++)if(w(v,A)<=e.getCapacity(A,p,o.MIXED))return A}e.from=function(p,A){return n.isValid(p)?parseInt(p,10):A},e.getCapacity=function(p,A,m){if(!n.isValid(p))throw new Error("Invalid QR Code version");typeof m>"u"&&(m=o.BYTE);const _=t.getSymbolTotalCodewords(p),b=i.getTotalCodewordsCount(p,A),f=(_-b)*8;if(m===o.MIXED)return f;const g=f-c(m,p);switch(m){case o.NUMERIC:return Math.floor(g/10*3);case o.ALPHANUMERIC:return Math.floor(g/11*2);case o.KANJI:return Math.floor(g/13);case o.BYTE:default:return Math.floor(g/8)}},e.getBestVersionForData=function(p,A){let m;const _=r.from(A,r.M);if(Array.isArray(p)){if(p.length>1)return E(p,_);if(p.length===0)return 1;m=p[0]}else m=p;return l(m.mode,m.getLength(),_)},e.getEncodedBits=function(p){if(!n.isValid(p)||p<7)throw new Error("Invalid QR Code version");let A=p<<12;for(;t.getBCHDigit(A)-a>=0;)A^=s<<t.getBCHDigit(A)-a;return p<<12|A}})(pt)),pt}var mt={},ln;function xi(){if(ln)return mt;ln=1;const e=$e(),t=1335,i=21522,r=e.getBCHDigit(t);return mt.getEncodedBits=function(n,s){const a=n.bit<<3|s;let l=a<<10;for(;e.getBCHDigit(l)-r>=0;)l^=t<<e.getBCHDigit(l)-r;return(a<<10|l)^i},mt}var bt={},yt,cn;function Ei(){if(cn)return yt;cn=1;const e=ve();function t(i){this.mode=e.NUMERIC,this.data=i.toString()}return t.getBitsLength=function(r){return 10*Math.floor(r/3)+(r%3?r%3*3+1:0)},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(r){let o,n,s;for(o=0;o+3<=this.data.length;o+=3)n=this.data.substr(o,3),s=parseInt(n,10),r.put(s,10);const a=this.data.length-o;a>0&&(n=this.data.substr(o),s=parseInt(n,10),r.put(s,a*3+1))},yt=t,yt}var $t,un;function Ri(){if(un)return $t;un=1;const e=ve(),t=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function i(r){this.mode=e.ALPHANUMERIC,this.data=r}return i.getBitsLength=function(o){return 11*Math.floor(o/2)+6*(o%2)},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(o){let n;for(n=0;n+2<=this.data.length;n+=2){let s=t.indexOf(this.data[n])*45;s+=t.indexOf(this.data[n+1]),o.put(s,11)}this.data.length%2&&o.put(t.indexOf(this.data[n]),6)},$t=i,$t}var vt,dn;function Si(){return dn||(dn=1,vt=function(t){for(var i=[],r=t.length,o=0;o<r;o++){var n=t.charCodeAt(o);if(n>=55296&&n<=56319&&r>o+1){var s=t.charCodeAt(o+1);s>=56320&&s<=57343&&(n=(n-55296)*1024+s-56320+65536,o+=1)}if(n<128){i.push(n);continue}if(n<2048){i.push(n>>6|192),i.push(n&63|128);continue}if(n<55296||n>=57344&&n<65536){i.push(n>>12|224),i.push(n>>6&63|128),i.push(n&63|128);continue}if(n>=65536&&n<=1114111){i.push(n>>18|240),i.push(n>>12&63|128),i.push(n>>6&63|128),i.push(n&63|128);continue}i.push(239,191,189)}return new Uint8Array(i).buffer}),vt}var Ct,hn;function Ti(){if(hn)return Ct;hn=1;const e=Si(),t=ve();function i(r){this.mode=t.BYTE,typeof r=="string"&&(r=e(r)),this.data=new Uint8Array(r)}return i.getBitsLength=function(o){return o*8},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(r){for(let o=0,n=this.data.length;o<n;o++)r.put(this.data[o],8)},Ct=i,Ct}var xt,fn;function _i(){if(fn)return xt;fn=1;const e=ve(),t=$e();function i(r){this.mode=e.KANJI,this.data=r}return i.getBitsLength=function(o){return o*13},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(r){let o;for(o=0;o<this.data.length;o++){let n=t.toSJIS(this.data[o]);if(n>=33088&&n<=40956)n-=33088;else if(n>=57408&&n<=60351)n-=49472;else throw new Error("Invalid SJIS character: "+this.data[o]+`
Make sure your charset is UTF-8`);n=(n>>>8&255)*192+(n&255),r.put(n,13)}},xt=i,xt}var pn;function Ii(){return pn||(pn=1,(function(e){const t=ve(),i=Ei(),r=Ri(),o=Ti(),n=_i(),s=Bn(),a=$e(),l=ti();function c(b){return unescape(encodeURIComponent(b)).length}function w(b,f,g){const d=[];let k;for(;(k=b.exec(g))!==null;)d.push({data:k[0],index:k.index,mode:f,length:k[0].length});return d}function E(b){const f=w(s.NUMERIC,t.NUMERIC,b),g=w(s.ALPHANUMERIC,t.ALPHANUMERIC,b);let d,k;return a.isKanjiModeEnabled()?(d=w(s.BYTE,t.BYTE,b),k=w(s.KANJI,t.KANJI,b)):(d=w(s.BYTE_KANJI,t.BYTE,b),k=[]),f.concat(g,d,k).sort(function(S,R){return S.index-R.index}).map(function(S){return{data:S.data,mode:S.mode,length:S.length}})}function v(b,f){switch(f){case t.NUMERIC:return i.getBitsLength(b);case t.ALPHANUMERIC:return r.getBitsLength(b);case t.KANJI:return n.getBitsLength(b);case t.BYTE:return o.getBitsLength(b)}}function p(b){return b.reduce(function(f,g){const d=f.length-1>=0?f[f.length-1]:null;return d&&d.mode===g.mode?(f[f.length-1].data+=g.data,f):(f.push(g),f)},[])}function A(b){const f=[];for(let g=0;g<b.length;g++){const d=b[g];switch(d.mode){case t.NUMERIC:f.push([d,{data:d.data,mode:t.ALPHANUMERIC,length:d.length},{data:d.data,mode:t.BYTE,length:d.length}]);break;case t.ALPHANUMERIC:f.push([d,{data:d.data,mode:t.BYTE,length:d.length}]);break;case t.KANJI:f.push([d,{data:d.data,mode:t.BYTE,length:c(d.data)}]);break;case t.BYTE:f.push([{data:d.data,mode:t.BYTE,length:c(d.data)}])}}return f}function m(b,f){const g={},d={start:{}};let k=["start"];for(let $=0;$<b.length;$++){const S=b[$],R=[];for(let y=0;y<S.length;y++){const I=S[y],C=""+$+y;R.push(C),g[C]={node:I,lastCount:0},d[C]={};for(let T=0;T<k.length;T++){const x=k[T];g[x]&&g[x].node.mode===I.mode?(d[x][C]=v(g[x].lastCount+I.length,I.mode)-v(g[x].lastCount,I.mode),g[x].lastCount+=I.length):(g[x]&&(g[x].lastCount=I.length),d[x][C]=v(I.length,I.mode)+4+t.getCharCountIndicator(I.mode,f))}}k=R}for(let $=0;$<k.length;$++)d[k[$]].end=0;return{map:d,table:g}}function _(b,f){let g;const d=t.getBestModeForData(b);if(g=t.from(f,d),g!==t.BYTE&&g.bit<d.bit)throw new Error('"'+b+'" cannot be encoded with mode '+t.toString(g)+`.
 Suggested mode is: `+t.toString(d));switch(g===t.KANJI&&!a.isKanjiModeEnabled()&&(g=t.BYTE),g){case t.NUMERIC:return new i(b);case t.ALPHANUMERIC:return new r(b);case t.KANJI:return new n(b);case t.BYTE:return new o(b)}}e.fromArray=function(f){return f.reduce(function(g,d){return typeof d=="string"?g.push(_(d,null)):d.data&&g.push(_(d.data,d.mode)),g},[])},e.fromString=function(f,g){const d=E(f,a.isKanjiModeEnabled()),k=A(d),$=m(k,g),S=l.find_path($.map,"start","end"),R=[];for(let y=1;y<S.length-1;y++)R.push($.table[S[y]].node);return e.fromArray(p(R))},e.rawSplit=function(f){return e.fromArray(E(f,a.isKanjiModeEnabled()))}})(bt)),bt}var gn;function Ai(){if(gn)return ot;gn=1;const e=$e(),t=Bt(),i=pi(),r=gi(),o=wi(),n=mi(),s=bi(),a=Wn(),l=vi(),c=Ci(),w=xi(),E=ve(),v=Ii();function p($,S){const R=$.size,y=n.getPositions(S);for(let I=0;I<y.length;I++){const C=y[I][0],T=y[I][1];for(let x=-1;x<=7;x++)if(!(C+x<=-1||R<=C+x))for(let P=-1;P<=7;P++)T+P<=-1||R<=T+P||(x>=0&&x<=6&&(P===0||P===6)||P>=0&&P<=6&&(x===0||x===6)||x>=2&&x<=4&&P>=2&&P<=4?$.set(C+x,T+P,!0,!0):$.set(C+x,T+P,!1,!0))}}function A($){const S=$.size;for(let R=8;R<S-8;R++){const y=R%2===0;$.set(R,6,y,!0),$.set(6,R,y,!0)}}function m($,S){const R=o.getPositions(S);for(let y=0;y<R.length;y++){const I=R[y][0],C=R[y][1];for(let T=-2;T<=2;T++)for(let x=-2;x<=2;x++)T===-2||T===2||x===-2||x===2||T===0&&x===0?$.set(I+T,C+x,!0,!0):$.set(I+T,C+x,!1,!0)}}function _($,S){const R=$.size,y=c.getEncodedBits(S);let I,C,T;for(let x=0;x<18;x++)I=Math.floor(x/3),C=x%3+R-8-3,T=(y>>x&1)===1,$.set(I,C,T,!0),$.set(C,I,T,!0)}function b($,S,R){const y=$.size,I=w.getEncodedBits(S,R);let C,T;for(C=0;C<15;C++)T=(I>>C&1)===1,C<6?$.set(C,8,T,!0):C<8?$.set(C+1,8,T,!0):$.set(y-15+C,8,T,!0),C<8?$.set(8,y-C-1,T,!0):C<9?$.set(8,15-C-1+1,T,!0):$.set(8,15-C-1,T,!0);$.set(y-8,8,1,!0)}function f($,S){const R=$.size;let y=-1,I=R-1,C=7,T=0;for(let x=R-1;x>0;x-=2)for(x===6&&x--;;){for(let P=0;P<2;P++)if(!$.isReserved(I,x-P)){let le=!1;T<S.length&&(le=(S[T]>>>C&1)===1),$.set(I,x-P,le),C--,C===-1&&(T++,C=7)}if(I+=y,I<0||R<=I){I-=y,y=-y;break}}}function g($,S,R){const y=new i;R.forEach(function(P){y.put(P.mode.bit,4),y.put(P.getLength(),E.getCharCountIndicator(P.mode,$)),P.write(y)});const I=e.getSymbolTotalCodewords($),C=a.getTotalCodewordsCount($,S),T=(I-C)*8;for(y.getLengthInBits()+4<=T&&y.put(0,4);y.getLengthInBits()%8!==0;)y.putBit(0);const x=(T-y.getLengthInBits())/8;for(let P=0;P<x;P++)y.put(P%2?17:236,8);return d(y,$,S)}function d($,S,R){const y=e.getSymbolTotalCodewords(S),I=a.getTotalCodewordsCount(S,R),C=y-I,T=a.getBlocksCount(S,R),x=y%T,P=T-x,le=Math.floor(y/T),Ae=Math.floor(C/T),Un=Ae+1,Dt=le-Ae,zn=new l(Dt);let et=0;const De=new Array(T),Ot=new Array(T);let tt=0;const qn=new Uint8Array($.buffer);for(let xe=0;xe<T;xe++){const it=xe<P?Ae:Un;De[xe]=qn.slice(et,et+it),Ot[xe]=zn.encode(De[xe]),et+=it,tt=Math.max(tt,it)}const nt=new Uint8Array(y);let jt=0,ie,re;for(ie=0;ie<tt;ie++)for(re=0;re<T;re++)ie<De[re].length&&(nt[jt++]=De[re][ie]);for(ie=0;ie<Dt;ie++)for(re=0;re<T;re++)nt[jt++]=Ot[re][ie];return nt}function k($,S,R,y){let I;if(Array.isArray($))I=v.fromArray($);else if(typeof $=="string"){let le=S;if(!le){const Ae=v.rawSplit($);le=c.getBestVersionForData(Ae,R)}I=v.fromString($,le||40)}else throw new Error("Invalid data");const C=c.getBestVersionForData(I,R);if(!C)throw new Error("The amount of data is too big to be stored in a QR Code");if(!S)S=C;else if(S<C)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+C+`.
`);const T=g(S,R,I),x=e.getSymbolSize(S),P=new r(x);return p(P,S),A(P),m(P,S),b(P,R,0),S>=7&&_(P,S),f(P,T),isNaN(y)&&(y=s.getBestMask(P,b.bind(null,P,R))),s.applyMask(y,P),b(P,R,y),{modules:P,version:S,errorCorrectionLevel:R,maskPattern:y,segments:I}}return ot.create=function(S,R){if(typeof S>"u"||S==="")throw new Error("No input text");let y=t.M,I,C;return typeof R<"u"&&(y=t.from(R.errorCorrectionLevel,t.M),I=c.from(R.version),C=s.from(R.maskPattern),R.toSJISFunc&&e.setToSJISFunction(R.toSJISFunc)),k(S,I,y,C)},ot}var Et={},Rt={},wn;function Ln(){return wn||(wn=1,(function(e){function t(i){if(typeof i=="number"&&(i=i.toString()),typeof i!="string")throw new Error("Color should be defined as hex string");let r=i.slice().replace("#","").split("");if(r.length<3||r.length===5||r.length>8)throw new Error("Invalid hex color: "+i);(r.length===3||r.length===4)&&(r=Array.prototype.concat.apply([],r.map(function(n){return[n,n]}))),r.length===6&&r.push("F","F");const o=parseInt(r.join(""),16);return{r:o>>24&255,g:o>>16&255,b:o>>8&255,a:o&255,hex:"#"+r.slice(0,6).join("")}}e.getOptions=function(r){r||(r={}),r.color||(r.color={});const o=typeof r.margin>"u"||r.margin===null||r.margin<0?4:r.margin,n=r.width&&r.width>=21?r.width:void 0,s=r.scale||4;return{width:n,scale:n?4:s,margin:o,color:{dark:t(r.color.dark||"#000000ff"),light:t(r.color.light||"#ffffffff")},type:r.type,rendererOpts:r.rendererOpts||{}}},e.getScale=function(r,o){return o.width&&o.width>=r+o.margin*2?o.width/(r+o.margin*2):o.scale},e.getImageWidth=function(r,o){const n=e.getScale(r,o);return Math.floor((r+o.margin*2)*n)},e.qrToImageData=function(r,o,n){const s=o.modules.size,a=o.modules.data,l=e.getScale(s,n),c=Math.floor((s+n.margin*2)*l),w=n.margin*l,E=[n.color.light,n.color.dark];for(let v=0;v<c;v++)for(let p=0;p<c;p++){let A=(v*c+p)*4,m=n.color.light;if(v>=w&&p>=w&&v<c-w&&p<c-w){const _=Math.floor((v-w)/l),b=Math.floor((p-w)/l);m=E[a[_*s+b]?1:0]}r[A++]=m.r,r[A++]=m.g,r[A++]=m.b,r[A]=m.a}}})(Rt)),Rt}var mn;function Wi(){return mn||(mn=1,(function(e){const t=Ln();function i(o,n,s){o.clearRect(0,0,n.width,n.height),n.style||(n.style={}),n.height=s,n.width=s,n.style.height=s+"px",n.style.width=s+"px"}function r(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}e.render=function(n,s,a){let l=a,c=s;typeof l>"u"&&(!s||!s.getContext)&&(l=s,s=void 0),s||(c=r()),l=t.getOptions(l);const w=t.getImageWidth(n.modules.size,l),E=c.getContext("2d"),v=E.createImageData(w,w);return t.qrToImageData(v.data,n,l),i(E,c,w),E.putImageData(v,0,0),c},e.renderToDataURL=function(n,s,a){let l=a;typeof l>"u"&&(!s||!s.getContext)&&(l=s,s=void 0),l||(l={});const c=e.render(n,s,l),w=l.type||"image/png",E=l.rendererOpts||{};return c.toDataURL(w,E.quality)}})(Et)),Et}var St={},bn;function Pi(){if(bn)return St;bn=1;const e=Ln();function t(o,n){const s=o.a/255,a=n+'="'+o.hex+'"';return s<1?a+" "+n+'-opacity="'+s.toFixed(2).slice(1)+'"':a}function i(o,n,s){let a=o+n;return typeof s<"u"&&(a+=" "+s),a}function r(o,n,s){let a="",l=0,c=!1,w=0;for(let E=0;E<o.length;E++){const v=Math.floor(E%n),p=Math.floor(E/n);!v&&!c&&(c=!0),o[E]?(w++,E>0&&v>0&&o[E-1]||(a+=c?i("M",v+s,.5+p+s):i("m",l,0),l=0,c=!1),v+1<n&&o[E+1]||(a+=i("h",w),w=0)):l++}return a}return St.render=function(n,s,a){const l=e.getOptions(s),c=n.modules.size,w=n.modules.data,E=c+l.margin*2,v=l.color.light.a?"<path "+t(l.color.light,"fill")+' d="M0 0h'+E+"v"+E+'H0z"/>':"",p="<path "+t(l.color.dark,"stroke")+' d="'+r(w,c,l.margin)+'"/>',A='viewBox="0 0 '+E+" "+E+'"',_='<svg xmlns="http://www.w3.org/2000/svg" '+(l.width?'width="'+l.width+'" height="'+l.width+'" ':"")+A+' shape-rendering="crispEdges">'+v+p+`</svg>
`;return typeof a=="function"&&a(null,_),_},St}var yn;function Bi(){if(yn)return Ee;yn=1;const e=fi(),t=Ai(),i=Wi(),r=Pi();function o(n,s,a,l,c){const w=[].slice.call(arguments,1),E=w.length,v=typeof w[E-1]=="function";if(!v&&!e())throw new Error("Callback required as last argument");if(v){if(E<2)throw new Error("Too few arguments provided");E===2?(c=a,a=s,s=l=void 0):E===3&&(s.getContext&&typeof c>"u"?(c=l,l=void 0):(c=l,l=a,a=s,s=void 0))}else{if(E<1)throw new Error("Too few arguments provided");return E===1?(a=s,s=l=void 0):E===2&&!s.getContext&&(l=a,a=s,s=void 0),new Promise(function(p,A){try{const m=t.create(a,l);p(n(m,s,l))}catch(m){A(m)}})}try{const p=t.create(a,l);c(null,n(p,s,l))}catch(p){c(p)}}return Ee.create=t.create,Ee.toCanvas=o.bind(null,i.render),Ee.toDataURL=o.bind(null,i.renderToDataURL),Ee.toString=o.bind(null,function(n,s,a){return r.render(n,a)}),Ee}var Li=Bi();const ki=ei(Li),Ni=.1,$n=2.5,oe=7;function Tt(e,t,i){return e===t?!1:(e-t<0?t-e:e-t)<=i+Ni}function Mi(e,t){const i=Array.prototype.slice.call(ki.create(e,{errorCorrectionLevel:t}).modules.data,0),r=Math.sqrt(i.length);return i.reduce((o,n,s)=>(s%r===0?o.push([n]):o[o.length-1].push(n))&&o,[])}const Di={generate({uri:e,size:t,logoSize:i,padding:r=8,dotColor:o="var(--apkt-colors-black)"}){const s=[],a=Mi(e,"Q"),l=(t-2*r)/a.length,c=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];c.forEach(({x:m,y:_})=>{const b=(a.length-oe)*l*m+r,f=(a.length-oe)*l*_+r,g=.45;for(let d=0;d<c.length;d+=1){const k=l*(oe-d*2);s.push(Ue`
            <rect
              fill=${d===2?"var(--apkt-colors-black)":"var(--apkt-colors-white)"}
              width=${d===0?k-10:k}
              rx= ${d===0?(k-10)*g:k*g}
              ry= ${d===0?(k-10)*g:k*g}
              stroke=${o}
              stroke-width=${d===0?10:0}
              height=${d===0?k-10:k}
              x= ${d===0?f+l*d+10/2:f+l*d}
              y= ${d===0?b+l*d+10/2:b+l*d}
            />
          `)}});const w=Math.floor((i+25)/l),E=a.length/2-w/2,v=a.length/2+w/2-1,p=[];a.forEach((m,_)=>{m.forEach((b,f)=>{if(a[_][f]&&!(_<oe&&f<oe||_>a.length-(oe+1)&&f<oe||_<oe&&f>a.length-(oe+1))&&!(_>E&&_<v&&f>E&&f<v)){const g=_*l+l/2+r,d=f*l+l/2+r;p.push([g,d])}})});const A={};return p.forEach(([m,_])=>{A[m]?A[m]?.push(_):A[m]=[_]}),Object.entries(A).map(([m,_])=>{const b=_.filter(f=>_.every(g=>!Tt(f,g,l)));return[Number(m),b]}).forEach(([m,_])=>{_.forEach(b=>{s.push(Ue`<circle cx=${m} cy=${b} fill=${o} r=${l/$n} />`)})}),Object.entries(A).filter(([m,_])=>_.length>1).map(([m,_])=>{const b=_.filter(f=>_.some(g=>Tt(f,g,l)));return[Number(m),b]}).map(([m,_])=>{_.sort((f,g)=>f<g?-1:1);const b=[];for(const f of _){const g=b.find(d=>d.some(k=>Tt(f,k,l)));g?g.push(f):b.push([f])}return[m,b.map(f=>[f[0],f[f.length-1]])]}).forEach(([m,_])=>{_.forEach(([b,f])=>{s.push(Ue`
              <line
                x1=${m}
                x2=${m}
                y1=${b}
                y2=${f}
                stroke=${o}
                stroke-width=${l/($n/2)}
                stroke-linecap="round"
              />
            `)})}),s}},Oi=U`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: 100%;
    height: 100%;
    background-color: ${({colors:e})=>e.white};
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
  }

  :host {
    border-radius: ${({borderRadius:e})=>e[4]};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host([data-clear='true']) > wui-icon {
    display: none;
  }

  svg:first-child,
  wui-image,
  wui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    box-shadow: inset 0 0 0 4px ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: ${({borderRadius:e})=>e[6]};
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: #3396ff !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }

  wui-icon > svg {
    width: inherit;
    height: inherit;
  }
`;var he=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let te=class extends D{constructor(){super(...arguments),this.uri="",this.size=500,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),u`<wui-flex
      alignItems="center"
      justifyContent="center"
      class="wui-qr-code"
      direction="column"
      gap="4"
      width="100%"
      style="height: 100%"
    >
      ${this.templateVisual()} ${this.templateSvg()}
    </wui-flex>`}templateSvg(){return Ue`
      <svg viewBox="0 0 ${this.size} ${this.size}" width="100%" height="100%">
        ${Di.generate({uri:this.uri,size:this.size,logoSize:this.arenaClear?0:this.size/4})}
      </svg>
    `}templateVisual(){return this.imageSrc?u`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?u`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:u`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};te.styles=[Y,Oi];he([h()],te.prototype,"uri",void 0);he([h({type:Number})],te.prototype,"size",void 0);he([h()],te.prototype,"theme",void 0);he([h()],te.prototype,"imageSrc",void 0);he([h()],te.prototype,"alt",void 0);he([h({type:Boolean})],te.prototype,"arenaClear",void 0);he([h({type:Boolean})],te.prototype,"farcaster",void 0);te=he([N("wui-qr-code")],te);const ji=U`
  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var kn=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let Ve=class extends z{constructor(){super(),this.basic=!1}firstUpdated(){this.basic||H.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:B.state.view}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(t=>t())}render(){return this.onRenderProxy(),u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["0","5","5","5"]}
        gap="5"
      >
        <wui-shimmer width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>
        <wui-text variant="lg-medium" color="primary"> Scan this QR Code with your phone </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0)}qrCodeTemplate(){if(!this.uri||!this.ready)return null;const t=this.wallet?this.wallet.name:void 0;L.setWcLinking(void 0),L.setRecentWallet(this.wallet);const i=je.state.themeVariables["--apkt-qr-color"]??je.state.themeVariables["--w3m-qr-color"];return u` <wui-qr-code
      theme=${je.state.themeMode}
      uri=${this.uri}
      imageSrc=${O(ue.getWalletImage(this.wallet))}
      color=${O(i)}
      alt=${O(t)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){const t=!this.uri||!this.ready;return u`<wui-button
      .disabled=${t}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      Copy link
      <wui-icon size="sm" color="inherit" name="copy" slot="iconRight"></wui-icon>
    </wui-button>`}};Ve.styles=ji;kn([h({type:Boolean})],Ve.prototype,"basic",void 0);Ve=kn([N("w3m-connecting-wc-qrcode")],Ve);var Ui=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let vn=class extends D{constructor(){if(super(),this.wallet=B.state.data?.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");H.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:B.state.view}})}render(){return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${O(ue.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="md-regular" color="primary">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};vn=Ui([N("w3m-connecting-wc-unsupported")],vn);var Nn=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let Wt=class extends z{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=Tn.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(L.subscribeKey("wcUri",()=>{this.updateLoadingState()})),H.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:B.state.view}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;const{webapp_link:t,name:i}=this.wallet,{redirect:r,href:o}=M.formatUniversalUrl(t,this.uri);L.setWcLinking({name:i,href:o}),L.setRecentWallet(this.wallet),M.openHref(r,"_blank")}catch{this.error=!0}}};Nn([W()],Wt.prototype,"isLoading",void 0);Wt=Nn([N("w3m-connecting-wc-web")],Wt);const zi=U`
  :host([data-mobile-fullscreen='true']) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :host([data-mobile-fullscreen='true']) wui-ux-by-reown {
    margin-top: auto;
  }
`;var Ce=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let ae=class extends D{constructor(){super(),this.wallet=B.state.data?.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=!!q.state.siwx,this.remoteFeatures=q.state.remoteFeatures,this.displayBranding=!0,this.basic=!1,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(q.subscribeKey("remoteFeatures",t=>this.remoteFeatures=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return q.state.enableMobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),u`
      ${this.headerTemplate()}
      <div class="platform-container">${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){return!this.remoteFeatures?.reownBranding||!this.displayBranding?null:u`<wui-ux-by-reown></wui-ux-by-reown>`}async initializeConnection(t=!1){if(!(this.platform==="browser"||q.state.manualWCControl&&!t))try{const{wcPairingExpiry:i,status:r}=L.state,{redirectView:o}=B.state.data??{};if(t||q.state.enableEmbedded||M.isPairingExpired(i)||r==="connecting"){const n=L.getConnections(ee.state.activeChain),s=this.remoteFeatures?.multiWallet,a=n.length>0;await L.connectWalletConnect({cache:"never"}),this.isSiwxEnabled||(a&&s?(B.replace("ProfileWallets"),Be.showSuccess("New Wallet Added")):o?B.replace(o):En.close())}}catch(i){if(i instanceof Error&&i.message.includes("An error occurred when attempting to switch chain")&&!q.state.enableNetworkSwitch&&ee.state.activeChain){ee.setActiveCaipNetwork(Kn.getUnsupportedNetwork(`${ee.state.activeChain}:${ee.state.activeCaipNetwork?.id}`)),ee.showUnsupportedChainUI();return}i instanceof Rn&&i.originalName===Sn.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?H.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:i.message}}):H.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:i?.message??"Unknown"}}),L.setWcError(!0),Be.showError(i.message??"Connection error"),L.resetWcConnection(),B.goBack()}}determinePlatforms(){if(!this.wallet){this.platforms.push("qrcode"),this.platform="qrcode";return}if(this.platform)return;const{mobile_link:t,desktop_link:i,webapp_link:r,injected:o,rdns:n}=this.wallet,s=o?.map(({injected_id:m})=>m).filter(Boolean),a=[...n?[n]:s??[]],l=q.state.isUniversalProvider?!1:a.length,c=t,w=r,E=L.checkInstalled(a),v=l&&E,p=i&&!M.isMobile();v&&!ee.state.noAdapters&&this.platforms.push("browser"),c&&this.platforms.push(M.isMobile()?"mobile":"qrcode"),w&&this.platforms.push("web"),p&&this.platforms.push("desktop");const A=Gn.isCustomDeeplinkWallet(this.wallet.id,ee.state.activeChain);!v&&l&&!ee.state.noAdapters&&!A&&this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return u`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return u`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return u`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return u`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return u`<w3m-connecting-wc-qrcode ?basic=${this.basic}></w3m-connecting-wc-qrcode>`;default:return u`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?u`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(t){const i=this.shadowRoot?.querySelector("div");i&&(await i.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=t,i.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};ae.styles=zi;Ce([W()],ae.prototype,"platform",void 0);Ce([W()],ae.prototype,"platforms",void 0);Ce([W()],ae.prototype,"isSiwxEnabled",void 0);Ce([W()],ae.prototype,"remoteFeatures",void 0);Ce([h({type:Boolean})],ae.prototype,"displayBranding",void 0);Ce([h({type:Boolean})],ae.prototype,"basic",void 0);ae=Ce([N("w3m-connecting-wc-view")],ae);var Lt=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let He=class extends D{constructor(){super(),this.unsubscribe=[],this.isMobile=M.isMobile(),this.remoteFeatures=q.state.remoteFeatures,this.unsubscribe.push(q.subscribeKey("remoteFeatures",t=>this.remoteFeatures=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){if(this.isMobile){const{featured:t,recommended:i}=j.state,{customWallets:r}=q.state,o=Qn.getRecentWallets(),n=t.length||i.length||r?.length||o.length;return u`<wui-flex flexDirection="column" gap="2" .margin=${["1","3","3","3"]}>
        ${n?u`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return u`<wui-flex flexDirection="column" .padding=${["0","0","4","0"]}>
        <w3m-connecting-wc-view ?basic=${!0} .displayBranding=${!1}></w3m-connecting-wc-view>
        <wui-flex flexDirection="column" .padding=${["0","3","0","3"]}>
          <w3m-all-wallets-widget></w3m-all-wallets-widget>
        </wui-flex>
      </wui-flex>
      ${this.reownBrandingTemplate()} `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding?u` <wui-flex flexDirection="column" .padding=${["1","0","1","0"]}>
      <wui-ux-by-reown></wui-ux-by-reown>
    </wui-flex>`:null}};Lt([W()],He.prototype,"isMobile",void 0);Lt([W()],He.prototype,"remoteFeatures",void 0);He=Lt([N("w3m-connecting-wc-basic-view")],He);const qi=e=>e.strings===void 0;const Pe=(e,t)=>{const i=e._$AN;if(i===void 0)return!1;for(const r of i)r._$AO?.(t,!1),Pe(r,t);return!0},Ke=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while(i?.size===0)},Mn=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),Hi(t)}};function Fi(e){this._$AN!==void 0?(Ke(this),this._$AM=e,Mn(this)):this._$AM=e}function Vi(e,t=!1,i=0){const r=this._$AH,o=this._$AN;if(o!==void 0&&o.size!==0)if(t)if(Array.isArray(r))for(let n=i;n<r.length;n++)Pe(r[n],!1),Ke(r[n]);else r!=null&&(Pe(r,!1),Ke(r));else Pe(this,e)}const Hi=e=>{e.type==Yn.CHILD&&(e._$AP??=Vi,e._$AQ??=Fi)};class Ki extends Jn{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,r){super._$AT(t,i,r),Mn(this),this.isConnected=t._$AU}_$AO(t,i=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),i&&(Pe(this,t),Ke(this))}setValue(t){if(qi(this._$Ct))this._$Ct._$AI(t,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}const kt=()=>new Gi;class Gi{}const _t=new WeakMap,Nt=Xn(class extends Ki{render(e){return zt}update(e,[t]){const i=t!==this.G;return i&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),zt}rt(e){if(this.G!==void 0)if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let i=_t.get(t);i===void 0&&(i=new WeakMap,_t.set(t,i)),i.get(this.G)!==void 0&&this.G.call(this.ht,void 0),i.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?_t.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),Qi=U`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    user-select: none;
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({colors:e})=>e.neutrals300};
    border-radius: ${({borderRadius:e})=>e.round};
    border: 1px solid transparent;
    will-change: border;
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  span:before {
    content: '';
    position: absolute;
    background-color: ${({colors:e})=>e.white};
    border-radius: 50%;
  }

  /* -- Sizes --------------------------------------------------------- */
  label[data-size='lg'] {
    width: 48px;
    height: 32px;
  }

  label[data-size='md'] {
    width: 40px;
    height: 28px;
  }

  label[data-size='sm'] {
    width: 32px;
    height: 22px;
  }

  label[data-size='lg'] > span:before {
    height: 24px;
    width: 24px;
    left: 4px;
    top: 3px;
  }

  label[data-size='md'] > span:before {
    height: 20px;
    width: 20px;
    left: 4px;
    top: 3px;
  }

  label[data-size='sm'] > span:before {
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
  }

  /* -- Focus states --------------------------------------------------- */
  input:focus-visible:not(:checked) + span,
  input:focus:not(:checked) + span {
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    background-color: ${({tokens:e})=>e.theme.textTertiary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  input:focus-visible:checked + span,
  input:focus:checked + span {
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  /* -- Checked states --------------------------------------------------- */
  input:checked + span {
    background-color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  label[data-size='lg'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='md'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='sm'] > input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }

  /* -- Hover states ------------------------------------------------------- */
  label:hover > input:not(:checked):not(:disabled) + span {
    background-color: ${({colors:e})=>e.neutrals400};
  }

  label:hover > input:checked:not(:disabled) + span {
    background-color: ${({colors:e})=>e.accent080};
  }

  /* -- Disabled state --------------------------------------------------- */
  label:has(input:disabled) {
    pointer-events: none;
    user-select: none;
  }

  input:not(:checked):disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:checked:disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:not(:checked):disabled + span::before {
    background-color: ${({colors:e})=>e.neutrals400};
  }

  input:checked:disabled + span::before {
    background-color: ${({tokens:e})=>e.theme.textTertiary};
  }
`;var Ze=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let Se=class extends D{constructor(){super(...arguments),this.inputElementRef=kt(),this.checked=!1,this.disabled=!1,this.size="md"}render(){return u`
      <label data-size=${this.size}>
        <input
          ${Nt(this.inputElementRef)}
          type="checkbox"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};Se.styles=[Y,ye,Qi];Ze([h({type:Boolean})],Se.prototype,"checked",void 0);Ze([h({type:Boolean})],Se.prototype,"disabled",void 0);Ze([h()],Se.prototype,"size",void 0);Se=Ze([N("wui-toggle")],Se);const Ji=U`
  :host {
    height: auto;
  }

  :host > wui-flex {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`;var Dn=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let Ge=class extends D{constructor(){super(...arguments),this.checked=!1}render(){return u`
      <wui-flex>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-toggle
          ?checked=${this.checked}
          size="sm"
          @switchChange=${this.handleToggleChange.bind(this)}
        ></wui-toggle>
      </wui-flex>
    `}handleToggleChange(t){t.stopPropagation(),this.checked=t.detail,this.dispatchSwitchEvent()}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("certifiedSwitchChange",{detail:this.checked,bubbles:!0,composed:!0}))}};Ge.styles=[Y,ye,Ji];Dn([h({type:Boolean})],Ge.prototype,"checked",void 0);Ge=Dn([N("wui-certified-switch")],Ge);const Yi=U`
  :host {
    position: relative;
    width: 100%;
    display: inline-flex;
    flex-direction: column;
    gap: ${({spacing:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.textPrimary};
    caret-color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  .wui-input-text-container {
    position: relative;
    display: flex;
  }

  input {
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    color: inherit;
    background: transparent;
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
    caret-color: ${({tokens:e})=>e.core.textAccentPrimary};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[3]} ${({spacing:e})=>e[10]};
    font-size: ${({textSize:e})=>e.large};
    line-height: ${({typography:e})=>e["lg-regular"].lineHeight};
    letter-spacing: ${({typography:e})=>e["lg-regular"].letterSpacing};
    font-weight: ${({fontWeight:e})=>e.regular};
    font-family: ${({fontFamily:e})=>e.regular};
  }

  input[data-size='lg'] {
    padding: ${({spacing:e})=>e[4]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[4]} ${({spacing:e})=>e[10]};
  }

  @media (hover: hover) and (pointer: fine) {
    input:hover:enabled {
      border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    }
  }

  input:disabled {
    cursor: unset;
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
  }

  input::placeholder {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  input:focus:enabled {
    border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    -webkit-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
    -moz-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
    box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  div.wui-input-text-container:has(input:disabled) {
    opacity: 0.5;
  }

  wui-icon.wui-input-text-left-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    left: ${({spacing:e})=>e[4]};
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button.wui-input-text-submit-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e[3]};
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    border-radius: ${({borderRadius:e})=>e[2]};
    color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  button.wui-input-text-submit-button:disabled {
    opacity: 1;
  }

  button.wui-input-text-submit-button.loading wui-icon {
    animation: spin 1s linear infinite;
  }

  button.wui-input-text-submit-button:hover {
    background: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  input:has(+ .wui-input-text-submit-button) {
    padding-right: ${({spacing:e})=>e[12]};
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  input[type='search']::-webkit-search-decoration,
  input[type='search']::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-results-button,
  input[type='search']::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  /* -- Keyframes --------------------------------------------------- */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;var G=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let F=class extends D{constructor(){super(...arguments),this.inputElementRef=kt(),this.disabled=!1,this.loading=!1,this.placeholder="",this.type="text",this.value="",this.size="md"}render(){return u` <div class="wui-input-text-container">
        ${this.templateLeftIcon()}
        <input
          data-size=${this.size}
          ${Nt(this.inputElementRef)}
          data-testid="wui-input-text"
          type=${this.type}
          enterkeyhint=${O(this.enterKeyHint)}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this.dispatchInputChangeEvent.bind(this)}
          @keydown=${this.onKeyDown}
          .value=${this.value||""}
        />
        ${this.templateSubmitButton()}
        <slot class="wui-input-text-slot"></slot>
      </div>
      ${this.templateError()} ${this.templateWarning()}`}templateLeftIcon(){return this.icon?u`<wui-icon
        class="wui-input-text-left-icon"
        size="md"
        data-size=${this.size}
        color="inherit"
        name=${this.icon}
      ></wui-icon>`:null}templateSubmitButton(){return this.onSubmit?u`<button
        class="wui-input-text-submit-button ${this.loading?"loading":""}"
        @click=${this.onSubmit?.bind(this)}
        ?disabled=${this.disabled||this.loading}
      >
        ${this.loading?u`<wui-icon name="spinner" size="md"></wui-icon>`:u`<wui-icon name="chevronRight" size="md"></wui-icon>`}
      </button>`:null}templateError(){return this.errorText?u`<wui-text variant="sm-regular" color="error">${this.errorText}</wui-text>`:null}templateWarning(){return this.warningText?u`<wui-text variant="sm-regular" color="warning">${this.warningText}</wui-text>`:null}dispatchInputChangeEvent(){this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value?.value,bubbles:!0,composed:!0}))}};F.styles=[Y,ye,Yi];G([h()],F.prototype,"icon",void 0);G([h({type:Boolean})],F.prototype,"disabled",void 0);G([h({type:Boolean})],F.prototype,"loading",void 0);G([h()],F.prototype,"placeholder",void 0);G([h()],F.prototype,"type",void 0);G([h()],F.prototype,"value",void 0);G([h()],F.prototype,"errorText",void 0);G([h()],F.prototype,"warningText",void 0);G([h()],F.prototype,"onSubmit",void 0);G([h()],F.prototype,"size",void 0);G([h({attribute:!1})],F.prototype,"onKeyDown",void 0);F=G([N("wui-input-text")],F);const Xi=U`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.iconDefault};
    cursor: pointer;
    padding: ${({spacing:e})=>e[2]};
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
  }

  @media (hover: hover) {
    wui-icon:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }
`;var On=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let Qe=class extends D{constructor(){super(...arguments),this.inputComponentRef=kt(),this.inputValue=""}render(){return u`
      <wui-input-text
        ${Nt(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
        @inputChange=${this.onInputChange}
      >
        ${this.inputValue?u`<wui-icon
              @click=${this.clearValue}
              color="inherit"
              size="sm"
              name="close"
            ></wui-icon>`:null}
      </wui-input-text>
    `}onInputChange(t){this.inputValue=t.detail||""}clearValue(){const i=this.inputComponentRef.value?.inputElementRef.value;i&&(i.value="",this.inputValue="",i.focus(),i.dispatchEvent(new Event("input")))}};Qe.styles=[Y,Xi];On([h()],Qe.prototype,"inputValue",void 0);Qe=On([N("wui-search-bar")],Qe);const Zi=U`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 104px;
    width: 104px;
    row-gap: ${({spacing:e})=>e[2]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--apkt-path-network);
    clip-path: var(--apkt-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: ${({tokens:e})=>e.theme.foregroundSecondary};
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`;var jn=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let Je=class extends D{constructor(){super(...arguments),this.type="wallet"}render(){return u`
      ${this.shimmerTemplate()}
      <wui-shimmer width="80px" height="20px"></wui-shimmer>
    `}shimmerTemplate(){return this.type==="network"?u` <wui-shimmer data-type=${this.type} width="48px" height="54px"></wui-shimmer>
        ${Zn}`:u`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}};Je.styles=[Y,ye,Zi];jn([h()],Je.prototype,"type",void 0);Je=jn([N("wui-card-select-loader")],Je);const er=_n`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var Q=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let V=class extends D{render(){return this.style.cssText=`
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap&&`var(--apkt-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--apkt-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--apkt-spacing-${this.gap})`};
      padding-top: ${this.padding&&se.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&se.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&se.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&se.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&se.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&se.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&se.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&se.getSpacingStyles(this.margin,3)};
    `,u`<slot></slot>`}};V.styles=[Y,er];Q([h()],V.prototype,"gridTemplateRows",void 0);Q([h()],V.prototype,"gridTemplateColumns",void 0);Q([h()],V.prototype,"justifyItems",void 0);Q([h()],V.prototype,"alignItems",void 0);Q([h()],V.prototype,"justifyContent",void 0);Q([h()],V.prototype,"alignContent",void 0);Q([h()],V.prototype,"columnGap",void 0);Q([h()],V.prototype,"rowGap",void 0);Q([h()],V.prototype,"gap",void 0);Q([h()],V.prototype,"padding",void 0);Q([h()],V.prototype,"margin",void 0);V=Q([N("wui-grid")],V);const tr=U`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[0]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: clamp(0px, ${({borderRadius:e})=>e[4]}, 20px);
    transition:
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-1"]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: ${({tokens:e})=>e.theme.textPrimary};
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:disabled > wui-flex > wui-text {
    color: ${({tokens:e})=>e.core.glass010};
  }

  [data-selected='true'] {
    background-color: ${({colors:e})=>e.accent020};
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: ${({colors:e})=>e.accent010};
    }
  }

  [data-selected='true']:active:enabled {
    background-color: ${({colors:e})=>e.accent010};
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`;var ne=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let K=class extends D{constructor(){super(),this.observer=new IntersectionObserver(()=>{}),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.isImpressed=!1,this.explorerId="",this.walletQuery="",this.certified=!1,this.displayIndex=0,this.wallet=void 0,this.observer=new IntersectionObserver(t=>{t.forEach(i=>{i.isIntersecting?(this.visible=!0,this.fetchImageSrc(),this.sendImpressionEvent()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){const t=this.wallet?.badge_type==="certified";return u`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="1">
          <wui-text
            variant="md-regular"
            color="inherit"
            class=${O(t?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${t?u`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():u`
      <wui-wallet-image
        size="lg"
        imageSrc=${O(this.imageSrc)}
        name=${O(this.wallet?.name)}
        .installed=${this.wallet?.installed??!1}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return u`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=ue.getWalletImage(this.wallet),!this.imageSrc&&(this.imageLoading=!0,this.imageSrc=await ue.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}sendImpressionEvent(){!this.wallet||this.isImpressed||(this.isImpressed=!0,H.sendWalletImpressionEvent({name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.explorerId,view:B.state.view,query:this.walletQuery,certified:this.certified,displayIndex:this.displayIndex}))}};K.styles=tr;ne([W()],K.prototype,"visible",void 0);ne([W()],K.prototype,"imageSrc",void 0);ne([W()],K.prototype,"imageLoading",void 0);ne([W()],K.prototype,"isImpressed",void 0);ne([h()],K.prototype,"explorerId",void 0);ne([h()],K.prototype,"walletQuery",void 0);ne([h()],K.prototype,"certified",void 0);ne([h()],K.prototype,"displayIndex",void 0);ne([h({type:Object})],K.prototype,"wallet",void 0);K=ne([N("w3m-all-wallets-list-item")],K);const nr=U`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  w3m-all-wallets-list-item {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-inout-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-loading-spinner {
    padding-top: ${({spacing:e})=>e[4]};
    padding-bottom: ${({spacing:e})=>e[4]};
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var Ne=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};const Cn="local-paginator";let me=class extends D{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!j.state.wallets.length,this.wallets=j.state.wallets,this.mobileFullScreen=q.state.enableMobileFullScreen,this.unsubscribe.push(j.subscribeKey("wallets",t=>this.wallets=t))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),this.paginationObserver?.disconnect()}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),u`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","3","3","3"]}
        gap="2"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;const t=this.shadowRoot?.querySelector("wui-grid");t&&(await j.fetchWalletsByPage({page:1}),await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(t,i){return[...Array(t)].map(()=>u`
        <wui-card-select-loader type="wallet" id=${O(i)}></wui-card-select-loader>
      `)}walletsTemplate(){return At.getWalletConnectWallets(this.wallets).map((t,i)=>u`
        <w3m-all-wallets-list-item
          data-testid="wallet-search-item-${t.id}"
          @click=${()=>this.onConnectWallet(t)}
          .wallet=${t}
          explorerId=${t.id}
          certified=${this.badge==="certified"}
          displayIndex=${i}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){const{wallets:t,recommended:i,featured:r,count:o,mobileFilteredOutWalletsLength:n}=j.state,s=window.innerWidth<352?3:4,a=t.length+i.length;let c=Math.ceil(a/s)*s-a+s;return c-=t.length?r.length%s:0,o===0&&r.length>0?null:o===0||[...r,...t,...i].length<o-(n??0)?this.shimmerTemplate(c,Cn):null}createPaginationObserver(){const t=this.shadowRoot?.querySelector(`#${Cn}`);t&&(this.paginationObserver=new IntersectionObserver(([i])=>{if(i?.isIntersecting&&!this.loading){const{page:r,count:o,wallets:n}=j.state;n.length<o&&j.fetchWalletsByPage({page:r+1})}}),this.paginationObserver.observe(t))}onConnectWallet(t){J.selectWalletConnector(t)}};me.styles=nr;Ne([W()],me.prototype,"loading",void 0);Ne([W()],me.prototype,"wallets",void 0);Ne([W()],me.prototype,"badge",void 0);Ne([W()],me.prototype,"mobileFullScreen",void 0);me=Ne([N("w3m-all-wallets-list")],me);const ir=_n`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
    height: auto;
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;var Me=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let be=class extends D{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.mobileFullScreen=q.state.enableMobileFullScreen,this.query=""}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.onSearch(),this.loading?u`<wui-loading-spinner color="accent-primary"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){(this.query.trim()!==this.prevQuery.trim()||this.badge!==this.prevBadge)&&(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await j.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){const{search:t}=j.state,i=At.markWalletsAsInstalled(t),r=At.filterWalletsByWcSupport(i);return r.length?u`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","3","3","3"]}
        rowGap="4"
        columngap="2"
        justifyContent="space-between"
      >
        ${r.map((o,n)=>u`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(o)}
              .wallet=${o}
              data-testid="wallet-search-item-${o.id}"
              explorerId=${o.id}
              certified=${this.badge==="certified"}
              walletQuery=${this.query}
              displayIndex=${n}
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:u`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="3"
          flexDirection="column"
        >
          <wui-icon-box size="lg" color="default" icon="wallet"></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="secondary" variant="md-medium">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(t){J.selectWalletConnector(t)}};be.styles=ir;Me([W()],be.prototype,"loading",void 0);Me([W()],be.prototype,"mobileFullScreen",void 0);Me([h()],be.prototype,"query",void 0);Me([h()],be.prototype,"badge",void 0);be=Me([N("w3m-all-wallets-search")],be);var Mt=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let Ye=class extends D{constructor(){super(...arguments),this.search="",this.badge=void 0,this.onDebouncedSearch=M.debounce(t=>{this.search=t})}render(){const t=this.search.length>=2;return u`
      <wui-flex .padding=${["1","3","3","3"]} gap="2" alignItems="center">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge==="certified"}
          @certifiedSwitchChange=${this.onCertifiedSwitchChange.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${t||this.badge?u`<w3m-all-wallets-search
            query=${this.search}
            .badge=${this.badge}
          ></w3m-all-wallets-search>`:u`<w3m-all-wallets-list .badge=${this.badge}></w3m-all-wallets-list>`}
    `}onInputChange(t){this.onDebouncedSearch(t.detail)}onCertifiedSwitchChange(t){t.detail?(this.badge="certified",Be.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})):this.badge=void 0}qrButtonTemplate(){return M.isMobile()?u`
        <wui-icon-box
          size="xl"
          iconSize="xl"
          color="accent-primary"
          icon="qrCode"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){B.push("ConnectingWalletConnect")}};Mt([W()],Ye.prototype,"search",void 0);Mt([W()],Ye.prototype,"badge",void 0);Ye=Mt([N("w3m-all-wallets-view")],Ye);var rr=function(e,t,i,r){var o=arguments.length,n=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n};let xn=class extends D{constructor(){super(...arguments),this.wallet=B.state.data?.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return u`
      <wui-flex gap="2" flexDirection="column" .padding=${["3","3","4","3"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?u`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?u`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?u`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?u`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="md-medium" color="primary">Website</wui-text>
      </wui-list-item>
    `:null}openStore(t){t.href&&this.wallet&&(H.sendEvent({type:"track",event:"GET_WALLET",properties:{name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.wallet.id,type:t.type}}),M.openHref(t.href,"_blank"))}onChromeStore(){this.wallet?.chrome_store&&this.openStore({href:this.wallet.chrome_store,type:"chrome_store"})}onAppStore(){this.wallet?.app_store&&this.openStore({href:this.wallet.app_store,type:"app_store"})}onPlayStore(){this.wallet?.play_store&&this.openStore({href:this.wallet.play_store,type:"play_store"})}onHomePage(){this.wallet?.homepage&&this.openStore({href:this.wallet.homepage,type:"homepage"})}};xn=rr([N("w3m-downloads-view")],xn);export{Ye as W3mAllWalletsView,He as W3mConnectingWcBasicView,xn as W3mDownloadsView};
