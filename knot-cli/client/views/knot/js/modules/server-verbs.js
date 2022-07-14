var queryPremise = 'query/';



async function sendReq(reqName, param, type)
{
    const reqType = type == undefined ? 'POST' : type;

    if(param == undefined)
        return new Promise(resolve =>
            {
                let ajaxRequest = $.ajax({url: `${reqName}`, type: reqType, timeout: '4000'});
            
                ajaxRequest.fail(() => console.error('Holy shmokes.'));
                ajaxRequest.done((data) =>{ resolve(data); });
            });
    else
        return new Promise(resolve =>
            {
                let ajaxRequest = $.ajax({url: `${reqName}`, type: reqType, timeout: '4000', data: param});
            
                ajaxRequest.fail(() => console.error('Holy shmokes.'));
                ajaxRequest.done((data) =>{ resolve(data); });
            });
}

/**
 * @deprecated Who needs this really
 */
async function executeQuery(queryName, param)
{
    if(param == undefined)
        return new Promise(resolve =>
            {
                let ajaxRequest = $.ajax({url: `${queryPremise}${queryName}`, type: 'POST', timeout: '4000'});
            
                ajaxRequest.fail(() => console.error('Holy shmokes.'));
                ajaxRequest.done((data) =>{ resolve(data); });
            });
    else
        return new Promise(resolve =>
            {
                let ajaxRequest = $.ajax({url: `${queryPremise}${queryName}`, type: 'POST', timeout: '4000', data: param});
            
                ajaxRequest.fail(() => console.error('Holy shmokes.'));
                ajaxRequest.done((data) =>{ resolve(data); });
            });
}

export default { sendReq, executeQuery };