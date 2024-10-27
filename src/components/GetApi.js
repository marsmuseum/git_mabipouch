export const fetchListData = async ( npcName, serverName, channel, apiKey) => {
    
    const url = `https://open.api.nexon.com/mabinogi/v1/npcshop/list?npc_name=${encodeURIComponent(npcName)}&server_name=${encodeURIComponent(serverName)}&channel=${channel}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'x-nxopen-api-key': apiKey,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
}