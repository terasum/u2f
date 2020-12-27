class OracleController {

    constructor() {
    }

    health = async (ctx) =>{
       ctx.body = {oracle_status: "OK"}
    }

    hello = async (ctx) =>{
        ctx.body = {oracle_status: "hello"}
    }


    routers = () => {
        return [
            {
                path:"/oracle/health", 
                method: "GET",
                func: this.health 
            },
            {
                path:"/oracle/hello", 
                method: "POST",
                func: this.hello 
            }
        ]
    }
}

module.exports = OracleController;