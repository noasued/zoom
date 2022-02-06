### request & response:

![](../notes/note_img/getRequest.png) 


> 10: when user sends GET request to homepage, server respond with a template.

> 11: when user sends GET request to any page, server respond with a 'redirect'

### http:
- protocol, where all the servers work
    * `http://~~`
* **DOES NOT HAPPEN REAL-TIME**
    server has to get request _first_ in order to respond
* **stateless**: BE does not remember users 
    * no connection between the user & BE
     * After respond, BE forgets about the user(browser) and just wait for the next request. : reason why we use **cookie** or **session**

### Websocket :
*  another type of protocol that **allows real-time communication**
    * `ws://~~~`
* browser sends request -> server either accepts or deny that request.
* once it accepts, ***connection*** is established: 
    * server & user(browser) can communicate directly without request/response at any point. (bi-directional)
* connection can be between two BE servers

### WS: 
* websocket implementation for Node.js (library)
* it has the most basic, core feature of websocket
* install by using "npm i ws"