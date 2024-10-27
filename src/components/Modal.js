import React, {useEffect, useState} from "react";
import { extractColors } from "./utils";
import './Modal.css';

const getItemType = (itemName) => {
  if (itemName.includes('달걀') || itemName.includes('감자') || itemName.includes('옥수수') || itemName.includes('밀') || itemName.includes('보리')) {
      return '작물';
  }
  if (itemName.includes('양털') || itemName.includes('거미줄') || itemName.includes('실뭉치')) {
      return '방직';
  }
  if (itemName.includes('가죽')) {
      return '가죽';
  }
  if (itemName.includes('옷감')) {
      return '옷감';
  }
  if (itemName.includes('실크')) {
      return '실크';
  }
  if (itemName.includes('꽃바구니')) {
      return '꽃바구니';
  }
  return '기타'; // 기본값
};

const Modal = ({ item, closeModal, maxChannel, fetchItemsFromChannel }) => {
  const [matchingItems, setMatchingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const getMatchingItems = async() => {
    if (isFetching) return; //왜 호출량 두 배 이벤트가 발생하는 것임? 이미 호출 중이면 바로 종료

    console.log( 'getMatchingItems called' );
    setIsFetching(true);
    setLoading(true);
    setError(null);

    const colorsToMatch = extractColors(item.image_url);
    console.log('Selected Item Colors:', colorsToMatch);

    const matchedItems = [];

    for (let channel = 1; channel <= maxChannel; channel++){
      const items = await fetchItemsFromChannel(channel);
      console.log(`Fetching items from channel ${channel}:`, items);

      items.forEach(i => {
        const itemColors = extractColors(i.image_url);
        //console.log(`Item: ${i.item_display_name}, Colors:`, itemColors);

        // 색상 비교 전에 아이템 정보 출력
        console.log('Comparing with:', {
          name: i.item_display_name,
          colors: itemColors,
          channel: channel,
        });

        //색상 비교
        if (itemColors.some(color => colorsToMatch.includes(color))) {
          const type = getItemType(i.item_display_name); // 아이템 타입 결정
          matchedItems.push({channel, item: {...i, type}});
        }
      });
    }

    setMatchingItems(matchedItems);
    setLoading(false);
    setIsFetching(false); //호출 다 함
  };

  useEffect(() => {
    console.log('useEffect triggerd for item: ', item);
    getMatchingItems();
  }, [item]);

  //아이템 그룹화하는 함수
  const groupedItems = matchingItems.reduce((acc, { channel, item }) => {
    const { item_display_name, type } = item;

    if (!acc[type]) {
        acc[type] = {};
    }

    if (!acc[type][item_display_name]) {
        acc[type][item_display_name] = [];
    }

    acc[type][item_display_name].push(channel);
    return acc;
}, {});

    return (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{item.item_display_name}</h2>
            {item.image_url && (
              <img src={item.image_url} alt={item.item_display_name} />
            )}
            <button onClick={closeModal}>닫기</button>
            {loading && <p>로딩 중...</p>}
            {error && <p style={{ color: 'red' }}>오류: {error}</p>}
          
          <h3>색상이 일치하는 아이템:</h3>

            {Object.entries(groupedItems).length > 0 ? (
                Object.entries(groupedItems).map(([type, items]) => (
                  <div key={type}>
                      <h4>{type}</h4>
                      {Object.entries(items).map(([itemName, channels]) => (
                          <div key={itemName}>
                              {itemName}: {channels.length > 0 ? channels.join(', ') : '나오는 채널 없음'}
                          </div>
                      ))}
                  </div>
              ))
            ) : (
                <p>일치하는 아이템이 없습니다.</p>
                )}
          </div>
        </div>
      );
};

export default Modal;