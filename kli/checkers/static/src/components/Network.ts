interface StatusData {
  status: string;
}

export default class Network {
  serverUrl: string = "https://dev.dawidkomeza.pl/api/";
  constructor() {
  }
  public async getNetwork() {
    const res = await fetch(this.serverUrl + "status", {
      method: "POST",
    });
    const data: StatusData = await res.json();
    return data.status;
  }
  async addPlayer() {
    
  }
}
