import React, {useState} from "react";
import { fetchListData } from "./GetApi";
import ListSelector from "./GetList";
import './MainComponent.css';

//import { extractColors } from "./utils";
import Modal from "./Modal";

import CountdownTimer from "./CountdownTimer";



const MainConponent = () => {
    const [selectedNpc, setSelectedNpc] = useState("상인 네루");
    const [selectedServer, setSelectedServer] = useState("류트");
    const [selectedChannel, setSelectedChannel] = useState("1");
    const [selectedListData, setSelectedListData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //채널링 관련 팝업이나 뭐... 그런 거
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const API_KEY = process.env.REACT_APP_API_KEY;

    const channelCounts = {
        류트: 42,
        하프: 24,
        울프: 15,
        만돌린: 15,
    };
    

    const MAX_CHANNEL = channelCounts[selectedServer];

    const handleFetchListData = async (ch) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching NPC data...');
            const listData = await fetchListData(selectedNpc, selectedServer, ch, API_KEY);
            
            console.log('List Data:', listData);
            console.log(ch);

            //상점 탭 주머니로 필터링
            const pocketTab = listData.shop.find(tab => tab.tab_name === "주머니");
            setSelectedListData(pocketTab ? pocketTab.item : []);
            

        } catch (error) {
            setError(error.message);
            console.error('Error fetching select data: ', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchItemsFromChannel = async (channel) => {
        const url = `https://open.api.nexon.com/mabinogi/v1/npcshop/list?npc_name=${encodeURIComponent(selectedNpc)}&server_name=${encodeURIComponent(selectedServer)}&channel=${channel}`;
      
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'x-nxopen-api-key': API_KEY, // API_KEY를 상수로 정의한 부분에서 가져옵니다.
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const result = await response.json();
          
          const pocketTab = result.shop.find(tab => tab.tab_name === "주머니");
          return pocketTab ? pocketTab.item : []; // 주머니의 아이템 목록 반환
        } catch (error) {
          console.error('Error fetching items from channel:', error);
          return []; // 오류 발생 시 빈 배열 반환
        }
      };

    //클릭 모달 채널링
    const handleItemClick = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
        console.log('Modal opened for item: ', item);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
      };

    //채널 왔다갔다
    const nextChannel = () => {
        setSelectedChannel((prevChannel) => {
            const newChannel = (prevChannel % MAX_CHANNEL) + 1;
            handleFetchListData(newChannel);
            return newChannel;
        });

        
    };

    const previousChannel = () => {
        setSelectedChannel((prevChannel) => {
            const newChannel = (prevChannel === 1? MAX_CHANNEL : prevChannel - 1 );
            handleFetchListData(newChannel);
            return newChannel;
        });
    };


    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                    <h1 style={{margin: '10px'}}> 주머니 조회 </h1>
                    <CountdownTimer />
                </div>
            <div style={{alignItems: 'center', margin: '20px' }}>
                    <p> 마비노기의 게임 데이터는 평균 10분 후 확인 가능합니다. </p>
                    <p> 뭔소리냐면 리셋하자마자 바로 불러오기 누르면 오류납니다. 최소 5분에서 10분은 기다리삼. </p>
                </div>
            
            
            {loading && <p> 로딩 중 ... </p>}
            {error && <p style={{color: 'red'}}> 오류: {error}</p>}
            
            <div style={{ display:'flex', alignItems: 'center', margin: '10px' }}>
                <ListSelector
                    selectedNpc={selectedNpc} 
                    selectedServer={selectedServer} 
                    selectedChannel={selectedChannel} 
                    onSelectNpc={setSelectedNpc} 
                    onSelectServer={setSelectedServer} 
                    onSelectChannel={setSelectedChannel} 
                />

                <button onClick={() => handleFetchListData(selectedChannel)} style={{marginLeft: '10px'}}> 주머니 불러오기 </button>
                <button onClick={previousChannel} style={{marginLeft: '10px'}}> ◀ </button>
                <button onClick={nextChannel} style={{marginLeft: '10px'}}> ▶ </button>

            </div>

            {selectedListData.length > 0 && (
                <div>
                    
                    <table className="item-table">
                        <tbody>
                        {selectedListData.map((item, index) => {
                            
                            if (index % 6 === 0) {
                                return (
                                    <tr key={index}>
                                        {selectedListData.slice(index, index + 6).map((item, subIndex) => (
                                        <td key={subIndex} className="item">
                                            <div className="item-display-name">{item.item_display_name}</div>
                                            {item.image_url && (
                                            <img 
                                                src={item.image_url} 
                                                alt={item.item_display_name}
                                                onClick={() => handleItemClick(item)}
                                                style={{cursor: 'pointer'}}
                                            />
                                            )}

                                            {/* 색상 확인하기 */}
                                            
                                            {/* <div className="color-container">
                                                {index < 6 ? (
                                                    <>
                                                        {extractColors(item.image_url).slice(0, 2).map((color, colorIndex) => {
                                                            const rgbColor = color.replace(/^#/, '');
                                                            const rgb = `(${parseInt(rgbColor.slice(0, 2), 16)}, ${parseInt(rgbColor.slice(2, 4), 16)}, ${parseInt(rgbColor.slice(4, 6), 16)})`;
                                                            return (
                                                                <div key={colorIndex} className="color-preview">
                                                                    <div className="color-box" style={{ backgroundColor: color }} />
                                                                    <span className="color-text">{rgb}</span>
                                                                </div>
                                                            );
                                                })}
                                                    </>
                                                ) : (
                                                    <>
                                                        {extractColors(item.image_url).map((color, colorIndex) => {
                                                            const rgbColor = color.replace(/^#/, '');
                                                            const rgb = `(${parseInt(rgbColor.slice(0, 2), 16)}, ${parseInt(rgbColor.slice(2, 4), 16)}, ${parseInt(rgbColor.slice(4, 6), 16)})`;
                                                            return (
                                                                <div key={colorIndex} className="color-preview">
                                                                    <div className="color-box" style={{ backgroundColor: color }} />
                                                                    <span className="color-text">{rgb}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </>
                                                )}
                                            </div> */}

                                        </td>
                                        ))}
                                    </tr>
                                );
                            }
                            return null;
                            })}

                        </tbody>
                    </table>

                </div>
            )}

            {isModalOpen && selectedItem && (
                <Modal 
                item={selectedItem} 
                closeModal={closeModal} 
                maxChannel={MAX_CHANNEL}
                fetchItemsFromChannel={fetchItemsFromChannel}
                />
            )}

        </div>
    );
    

};

export default MainConponent;