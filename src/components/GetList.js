import React from "react";

const ListSelector = ({ selectedNpc, selectedServer, selectedChannel, onSelectNpc, onSelectServer, onSelectChannel }) => {
    
    const npcMapping = {
        "티르코네일": "상인 네루",
        "던바튼": "상인 누누",
        "탈틴": "상인 베루",
        "타라": "상인 에루",
        "이멘마하": "상인 메루",
        "반호르": "상인 라누",
        "카브": "상인 아루",
        "벨바스트": "상인 피루",
        "스카하": "상인 세누",
        "켈라": "테일로",
        "카루": "귀넥",
        "오아시스": "얼리",
        "필리아": "켄",
        "코르": "리나",
        "발레스": "카디",
        "칼리다": "모락",
        "페라": "데위"
    };
    
    const serverList = [ "류트", "하프", "만돌린", "울프" ];
    
    const channelCounts = {
        류트: 42,
        하프: 24,
        울프: 15,
        만돌린: 15,
      };

    const maxChannels = channelCounts[selectedServer];

    const handleChannelChange = (e) => {
        const channel = parseInt(e.target.value);
        if (channel < 1 || channel > maxChannels) {
            alert(`선택 가능한 채널 범위를 벗어났습니다! \n채널은 1에서 ${maxChannels} 사이여야 합니다.`)
        } else {
            onSelectChannel(channel);
        }
    };

    return (
        <div>
            <select value={selectedNpc} onChange={(e) => onSelectNpc(e.target.value)}>
                {Object.keys(npcMapping).map((displayName) => (
                    <option key={displayName} value={npcMapping[displayName]}>
                        {displayName}
                    </option>
                ))}
            </select>

            <select value={selectedServer} onChange={(e) => {
                        onSelectServer(e.target.value);
                        onSelectChannel(1);
                    }}>
                {serverList.map((server) => (
                    <option key={server} value={server}>
                        {server}
                    </option>
                ))}
            </select>

            <input
                type="number"
                value={selectedChannel}
                onChange={handleChannelChange}
                min={1}
                max={maxChannels}
                placeholder={`채널 (1-${maxChannels})`}
                style={{ width: '60px', marginLeft: '10px' }}
            />
        </div>
    );
};

export default ListSelector;