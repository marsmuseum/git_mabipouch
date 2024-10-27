export const extractColors = (url) => {
    if (!url) {
      console.warn('Image URL is undefined');
      return [];
    }
  
    /*
    const colorMatch = url.match(/item_color=%7B(.*?)%7D/);
    if (colorMatch) {
      const colorString = decodeURIComponent(colorMatch[1]);
      const colors = JSON.parse(`{${colorString}}`);
      return [
        colors.color_01,
        colors.color_02,
        colors.color_03,
      ];
    }
    return [];
    */
   
    // 정규 표현식으로 q= 뒤의 문자열을 추출
    
    const regex = /q=([^&]*)/;
    const match = url.match(regex);

    if (!match || match.length < 2) {
        console.warn('No valid query string found');
        return [];
    }

    const queryString = match[1];

    // 원하는 부분을 추출하기 위한 정규 표현식
    const colorPattern1 = /4b45(.*?)87464e/;
    const colorPattern2 = /87464e(.*?)8a5042/;
    const colorPattern3 = /8a5042(.*?)844350/;

    const color1 = queryString.match(colorPattern1);
    const color2 = queryString.match(colorPattern2);
    const color3 = queryString.match(colorPattern3);

    return [
        color1 ? color1[1] : null,
        color2 ? color2[1] : null,
        color3 ? color3[1] : null,
    ].filter(Boolean); // null 제거
  };