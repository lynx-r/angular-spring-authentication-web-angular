export class PongPayload {
  pong: string;
  // обязательно указать тип для десериализации на сервере
  type = 'PongPayload';

  constructor(pong: string) {
    this.pong = pong;
  }
}
