(function () {

  const ENGAGED_SESSION_THRESHOLD = 10000; // 10 seconds in milliseconds

  let startTime = null;
  let isEngaged = false;
  let isConverted = false;
  let isBounced = true;
  let coframeSessionIds = [];

  // Retrieve variants of your copy for each coframe you've set up from Coframe
  const getVariants = async () => {
    const queryParams = new URLSearchParams({
      coframe_page_id: COFRAME_PAGE_ID,
    });
  
    const apiUrl = "https://coframe.ai/api/v1/retrieve_variants_page?" + queryParams.toString();
  
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  };

  // Send results of the user's session (engagement, bounce, conversion, etc) to Coframe
  const sendDataToBackend = (data) => {
    const returnEndpointUrl = "https://coframe.ai/api/v1/session_result";

    data.session_ids = coframeSessionIds;

    fetch(returnEndpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch((error) => {
      console.error("Failed to send data:", error);
    });
  };

  const measureEngagement = () => {
      const timeSpent = Date.now() - startTime;
      if (timeSpent >= ENGAGED_SESSION_THRESHOLD) {
        isEngaged = true;
        sendDataToBackend({ "engagement": true });
      } else {
        setTimeout(measureEngagement, ENGAGED_SESSION_THRESHOLD - timeSpent);
      }
    };

  const measureConversion = () => {
    isConverted = true;
    isBounced = false;
    sendDataToBackend({ "conversion": true });
  };

  const measureBounce = () => {
    if (isBounced) {
      sendDataToBackend({ "bounced": true });
    }
  };

  // Replace all instances of the original text defined in a coframe with the copy from variant
  const replaceText = (original, copy) => {
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      const regex = new RegExp(original, 'g');
    
      let node;
      while (node = walk.nextNode()) {
        if (!node.parentElement || node.parentElement.tagName.toLowerCase() === 'script') {
          continue;
        }
        node.textContent = node.textContent.replace(regex, copy);
      }
  };

  const init = async () => {
    startTime = Date.now();
    window.addEventListener("beforeunload", measureBounce);
    document.addEventListener("visibilitychange", measureEngagement);
    document.addEventListener("conversion", measureConversion);
    setTimeout(measureEngagement, ENGAGED_SESSION_THRESHOLD);

    const variants_response = await getVariants();
    const variants = variants_response.variants;
    coframeSessionIds = variants_response.session_ids;
    
    variants.forEach(({ original, copy }) => {
      replaceText(original, copy);
    });
  };

  init();

})();

// Additional function provided for logging a conversion event
function logCoframeConversion() {
  document.dispatchEvent(new CustomEvent('conversion', {}));
}