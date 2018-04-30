export class PingPayload {
  ping: string;
  // обязательно указать тип для десериализации на сервере
  type = 'PingPayload';

  constructor(ping: string) {
    this.ping = ping;
  }
}
