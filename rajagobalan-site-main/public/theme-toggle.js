(function(){
  var KEY='ea-framework-theme';
  var FONT_KEY='ea-framework-font-size';
  
  // New Default: Light (so get() returns true if 'dark' is set)
  function get(){try{return localStorage.getItem(KEY)==='dark';}catch(e){return false;}}
  
  function set(dark){try{localStorage.setItem(KEY,dark?'dark':'light');}catch(e){}}
  
  function getFont(){try{var v=parseInt(localStorage.getItem(FONT_KEY),10);return isNaN(v)?100:Math.min(140,Math.max(90,v));}catch(e){return 100;}}
  
  function setFont(v){try{localStorage.setItem(FONT_KEY,String(v));}catch(e){}}
  
  function apply(dark){
    var d=document.documentElement;
    if(dark){
      d.setAttribute('data-theme','dark');
    }else{
      d.removeAttribute('data-theme');
    }
    window.dispatchEvent(new StorageEvent('storage',{key:KEY,newValue:dark?'dark':'light'}));
    window.dispatchEvent(new CustomEvent('themechange',{detail:{dark:dark}}));
    styleControls();
  }
  
  function applyFont(){
    var v=getFont();
    var scale=v/100;
    document.documentElement.style.setProperty('--user-font-scale',String(scale));
    var wrap=document.getElementById('font-scale-wrapper');
    if(wrap){
      document.documentElement.style.fontSize='16px';
      wrap.style.transform='scale('+scale+')';
      wrap.style.transformOrigin='top center';
      wrap.style.width=(100/scale)+'%';
    }else{
      document.documentElement.style.fontSize=(16*scale)+'px';
    }
    var s=document.getElementById('font-slider');if(s)s.value=v;
  }
  
  function styleControls(){
    var btn=document.getElementById('theme-toggle-btn');
    if(btn){
      btn.style.background='var(--md-sys-color-surface-container-low)';
      btn.style.borderColor='var(--md-sys-color-outline-variant)';
      btn.style.color='var(--md-sys-color-on-surface-secondary)';
    }
    var box=document.getElementById('theme-controls-box');
    if(box){
      box.style.background='var(--md-sys-color-surface-container-low)';
      box.style.borderColor='var(--md-sys-color-outline-variant)';
    }
    var lbl=document.getElementById('font-size-label');
    if(lbl){lbl.style.color='var(--md-sys-color-on-surface-secondary)';}
    var sl=document.getElementById('font-slider');
    if(sl){sl.style.accentColor='var(--md-sys-color-primary)';}
  }
  
  function toggle(){var d=!get();set(d);apply(d);updateBtn(d);}
  
  function updateBtn(dark){
    var btn=document.getElementById('theme-toggle-btn');
    if(btn){
      btn.innerHTML=(dark?'&#127769; Dark':'&#9728;&#65039; Light');
      btn.title=dark?'Switch to light':'Switch to dark';
    }
  }
  
  function onFontChange(e){var v=parseInt(e.target.value,10);setFont(v);applyFont();}
  
  function init(){
    var dark=get();
    apply(dark);
    
    var isTouch='ontouchstart' in window||navigator.maxTouchPoints>0;
    if(isTouch){
      var wrap=document.createElement('div');
      wrap.id='font-scale-wrapper';
      wrap.style.cssText='transform-origin:top center;min-height:100vh;box-sizing:border-box';
      // Only wrap if not already wrapped
      if (!document.getElementById('font-scale-wrapper')) {
        while(document.body.firstChild)wrap.appendChild(document.body.firstChild);
        document.body.appendChild(wrap);
      }
    }
    
    applyFont();
    
    // Only create controls if they don't exist
    if (document.getElementById('theme-controls-box')) return;

    var box=document.createElement('div');
    box.id='theme-controls-box';
    box.style.cssText='position:fixed;bottom:max(20px,env(safe-area-inset-bottom,0px));right:max(20px,env(safe-area-inset-right,0px));z-index:9999;display:flex;flex-direction:column;gap:8px;align-items:flex-end;padding:10px 12px;border-radius:12px;border:1px solid var(--md-sys-color-outline-variant);background:var(--md-sys-color-surface-container-low);box-shadow:0 4px 20px var(--md-sys-color-shadow)';
    
    // Add font size controls first (optional, kept from original design)
    var row=document.createElement('div');
    row.style.cssText='display:none;align-items:center;gap:10px;width:100%'; // Hidden by default unless requested
    
    var lbl=document.createElement('span');
    lbl.id='font-size-label';
    lbl.textContent='A';
    lbl.style.cssText='font-size:0.75rem;font-weight:600;color:var(--md-sys-color-on-surface-secondary);min-width:14px';
    
    var sl=document.createElement('input');
    sl.id='font-slider';
    sl.type='range';
    sl.min='90';
    sl.max='140';
    sl.step='5';
    sl.value=String(getFont());
    sl.style.cssText='width:70px;height:6px;cursor:pointer;accent-color:var(--md-sys-color-primary)';
    sl.title='Font size: '+getFont()+'%';
    
    sl.oninput=function(){var v=parseInt(sl.value,10);setFont(v);applyFont();sl.title='Font size: '+v+'%';};
    sl.onchange=sl.oninput;
    
    row.appendChild(lbl);
    row.appendChild(sl);
    box.appendChild(row);
    
    var btn=document.createElement('button');
    btn.id='theme-toggle-btn';
    btn.setAttribute('aria-label','Toggle theme');
    // Using flex row to align icon and text
    btn.style.cssText='padding:8px 16px;border-radius:24px;border:1px solid var(--md-sys-color-outline-variant);font-size:0.875rem;font-weight:500;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:8px;transition:all 0.2s ease;background:var(--md-sys-color-surface-container-low);color:var(--md-sys-color-on-surface-secondary);box-shadow:0 2px 8px rgba(0,0,0,0.1)';
    
    // Create toggle handler manually to ensure it works
    btn.onclick = function() {
      var isDark = get(); // current state
      var newDark = !isDark;
      set(newDark);
      apply(newDark);
      updateBtnText(btn, newDark);
    };
    
    // Initial text set
    updateBtnText(btn, dark);
    
    box.appendChild(btn);
    document.body.appendChild(box);

  }

  function updateBtnText(btn, isDark) {
    // Sun icon for Light, Moon icon for Dark
    if (isDark) {
      btn.innerHTML = '<i class="fas fa-sun" style="font-size:1rem;color:#FDB813"></i> Light Mode';
      btn.title = 'Switch to Light Mode';
    } else {
      btn.innerHTML = '<i class="fas fa-moon" style="font-size:1rem;color:#6b7280"></i> Dark Mode';
      btn.title = 'Switch to Dark Mode';
    }
  }
  
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();

// Version Check
(function() {
  async function checkVersion() {
    try {
      const response = await fetch('/version.json?t=' + new Date().getTime());
      if (!response.ok) return;
      const data = await response.json();
      const latestVersion = data.version;
      const currentVersion = localStorage.getItem('site_version');

      // If we have a stored version and it differs, show banner
      if (currentVersion && latestVersion !== currentVersion) {
        showUpdateNotification();
      }
      
      // Always update stored version to latest
      localStorage.setItem('site_version', latestVersion);
    } catch (e) {
      // Silent fail
    }
  }

  function showUpdateNotification() {
    if (document.getElementById('update-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'update-banner';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);text-align:center;padding:12px;z-index:10000;cursor:pointer;font-weight:bold;box-shadow:0 2px 10px rgba(0,0,0,0.2);transform:translateY(-100%);transition:transform 0.3s ease;';
    banner.innerHTML = 'New content available. Click to refresh.';
    banner.onclick = function(){ window.location.reload(true); };
    document.body.appendChild(banner);
    
    // Animate in
    requestAnimationFrame(function(){ banner.style.transform = 'translateY(0)'; });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkVersion);
  } else {
    checkVersion();
  }
})();
