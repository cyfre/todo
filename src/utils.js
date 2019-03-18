const api = {};
[
    { service: 'read', verb: 'GET', options: false },
    { service: 'create', verb: 'POST', options: true },
    { service: 'update', verb: 'PUT', options: true },
    { service: 'delete', verb: 'DELETE', options: false }
].forEach(({ service, verb, options }) => {
    api[service] = (path, params, callback) => {
        if (!options) callback = params;

        fetch('/api' + path.replace(/^\/api/, ''), { 
            method: verb,
            ...( options ? {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            } : {}),
        }).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    callback && callback(data);
                });
            } else {
                response.json().then(error => {
                    alert(`Failed to ${service} ${path}: ` + error.message);
                });
            }
        }).catch(error => {
            alert("Error in sending data to server: " + error.message);
        });
    }
})

export {
    api
};