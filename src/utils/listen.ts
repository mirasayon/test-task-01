export const listen = async (app: App, port: num, host: str): Promise<Server> =>
    await new Promise((rs, rj) => {
        const sv = app.listen(port, host, (err) => {
            if (err) return rj(err);
            rs(sv);
        });
    });
