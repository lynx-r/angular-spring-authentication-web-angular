## О проекте

Пример аутентификации без фреймворков для аутентификации на Angular и Spring (web Angular)

## Команды из package.json

```
# yarn start // запускает ng serve
# yarn prod // делает сборку проекта в production с base-ref /app
# yarn deploy // деплоит проект в локальную папку ~/Sites/app
```

[Сервер на Spring](https://github.com/lynx-r/angular-spring-authentication-server-spring)

## Angular-ngrx-starter

Demo: https://stackblitz.com/github/Angular-RU/angular-ngrx-starter

## Состав [@ngrx/platform](https://github.com/ngrx/platform) :

* [@ngrx/store](https://github.com/ngrx/platform/tree/master/docs/store/README.md) - менеджер состояний на основе RxJS для Angular приложений, вдохновленный Redux
* [@ngrx/effects](https://github.com/ngrx/platform/tree/master/docs/effects/README.md) - модуль для обработки side effect-ов и передачи их в @ngrx/store через actions
* [@ngrx/router-store](https://github.com/ngrx/platform/tree/master/docs/router-store/README.md) - добавляет Angular Router в @ngrx/store
* [@ngrx/store-devtools](https://github.com/ngrx/platform/tree/master/docs/store-devtools/README.md) - интегрирует приложение с 
  [powerful time-travelling debugger](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
* [@ngrx/entity](https://github.com/ngrx/platform/tree/master/docs/entity/README.md) - модуль для работы с коллекциями записей
* [@ngrx/schematics](https://github.com/ngrx/platform/tree/master/docs/schematics/README.md) - добавляет в Angular-CLI возможность генерации каркаса NgRx компонентов.


# Детали

# Пример самописной аутентификации на Angular и Spring (клиент на Angular-ngrx-starter)

## О чем эта статья

В этой статье я расскажу как добавить на ваш проект аутентификацию без помощи готовых решений для данной задачи. Я предлагаю посмотреть на приложения на Angular и Spring [Репозиторий клиента на Angular-ngrx-starter](https://github.com/lynx-r/angular-spring-authentication-web-angular) [Репозиторий сервера на Spring](https://github.com/lynx-r/angular-spring-authentication-server-spring).

Здесь мы рассмотрим клиентскую часть на Angular-ngrx-starter.

<cut/>

# Клиент использующий сервер аутентифкикации

Пример данного клиента на Angular может использоваться для взаимодействия с кем угодно по REST API. 

Посмотрим на структуру проекта:

    .
    ├── auth                                # Модуль аутентификации
    │   ├── actions
    │   │   └── auth.ts
    │   ├── auth-routing.module.ts
    │   ├── auth.module.ts
    │   ├── components
    │   │   ├── signin.component.ts
    │   │   └── signup.component.ts
    │   ├── containers
    │   │   ├── signin-page.component.ts
    │   │   └── signup-page.component.ts
    │   ├── effects
    │   │   └── auth.effects.ts
    │   ├── models
    │   │   ├── auth-user.ts
    │   │   └── user-credentials.ts
    │   ├── reducers
    │   │   ├── auth.ts
    │   │   ├── index.ts
    │   │   └── login-page.ts
    │   └── services
    │       └── auth.service.ts
    └── core                                # Главный модуль
        ├── components
        │   └── landing.component.ts
        ├── config
        │   ├── app-constants.ts
        │   ├── config.json
        │   └── profile.ts
        ├── containers
        │   ├── app.component.ts
        │   └── not-found-page.ts
        ├── core-routing.module.ts
        ├── core.module.ts
        ├── models
        │   ├── answer-message.ts
        │   ├── answer.ts                   # Ответ с сервера
        │   ├── notify-type.enum.ts
        │   ├── ping-payload.ts             # Данные для отправки на сервер
        │   └── pong-payload.ts             # Данные для получения ответа с сервера
        ├── reducers
        │   └── reducer.reducer.ts
        └── services
            ├── api-base.ts                 # Базовый сервис REST запросов
            ├── api-interceptor.ts
            ├── api-defended.service.ts
            ├── api-security.service.ts     # API сервис HTTP запросов и т.д.
            ├── cookies.service.ts
            ├── error-handling.service.ts
            ├── defended.service.ts
            ├── security.service.ts         # Сервис использующий HTTP API сервиса api-security.service
            ├── services.module.ts
            └── utils.service.ts
    
    15 directories, 41 files
  
## REST клиент для сервис аутентификации/авторизации/регистрации

Для коммуникации с сервером будем использовать обретку для `@angular/common/http/HttpClient` со следующей иерархией:

    api-base
    ├── api-security.service
    └──── security.service 

В них мы имеем вызовы `API` сервера аутнетификации.

Далее, ответы от сервиса `security.service` передаются ниже по иерархии в сервис `auth.service` в нем сохраняется состояние пользователя в `Store` и `Cookies`. `Cookies` используются для восстановления состояния аутнетифицированного пользователя после перезагрузки страницы. И в случае ошибок они обрабатываются путем отправления `Observable.throw` вниз по иерархии.

Приведу пример метода аутентификации:

```
authorize(credentials: UserCredentials): Observable<AuthUser | Failure> {
  return this.securityService.authorize(credentials) // Делаем HTTP запрос на сервер
    .pipe(
      tap(authUser => this.setAuthUserState(authUser)), // Сохраняем состояние пользователя
      catchError(error => { // Ловим ошибки
        return this.errorHandler.handleAuthError(error);
      })
    )
}
```

## Полезная нагрузка на сервер

Для отправки запросов на сервер есть обёртка `defended.service`, в которой вызывается метод `ping` `API` сервера на Spring.

## Прерыватель запросов (api-interceptor)

Для отправки данных об аутентифицированном пользователе используются прерыватель HTTP запросов, который кладёт в заголовки эти данные.

Приведу пример кода:

```
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  return this.authService.getLoggedUser() // Берём текущего залогиненного пользователя
    .pipe(
      map(authUser => {
        // Добавляем данные в заголовки
        let clonedRequest = req.clone();
        let isLoggedIn = UtilsService.isLoggedIn(authUser);
        if (isLoggedIn) {
          clonedRequest = clonedRequest.clone(
            {
              headers:
                clonedRequest.headers
                  .append(AppConstants.ACCESS_TOKEN_HEADER, authUser.accessToken)
                  .append(AppConstants.USER_SESSION_HEADER, authUser.userSession)
                  .append(AppConstants.USER_ROLES_HEADER, authUser.authorities.join(','))
            }
          );
        } else {
          clonedRequest = clonedRequest.clone(
            {
              headers:
                clonedRequest.headers
                  .append(AppConstants.USER_ROLES_HEADER, AppConstants.ANONYMOUS_ROLE)
            }
          );
        }
        return next.handle(clonedRequest);
      }),
      switchMap(value => {
        return value;
      }),
    );
}
```

# Схема взаимодействия с сервером

![Схема взаимодействия с сервером](https://github.com/lynx-r/angular-spring-authentication-web-angular/blob/master/Пример%20двух%20ping%20запросов%20на%20сервер.png)

Как видно из диаграммы последовательностей, после загрузки страницы отправляется запрос на аутентификацию. Здесь рассмотрен случай с пройденной аутентификации. Далее, после получения этого запроса, сервер выдает токен. Нужно заметить, что токен выдаётся не просто так, а после авторизации, которая для упрощения схемы не показана. Подробности по авторизации можно прочитать в смежной статье. Затем, после генерации токена, возвращается ответ клиенту. Клиент сохраняет его и выполняет `ping` запрос к серверу с полученным ранее токеном. Сервер проверяет токен, генерирует новый токен и обрабатывает данные `ping` запроса. В нашем примере он просто формирует строку `"${data.getPing()} from ${authUser.getUsername()} and PONG from server"`. После получения ответа с сервера, клиент сохраняет токен и выполняет с этим токеном второй запрос.

Если токен потеряется или клиент его не правильно сохранит, то этот и следующие запросы не пройдут до тех пор, пока пользователь не авторизуется повторно.

# Замечение

Все остально работает так, как вы привыкли видеть в примерах приложений на ngrx.

# Заключение

В этой статье мы рассмотрели как сделать простой клиент аутентификации с помощью Angular-ngrx-starter.

# Ссылки

* [Angular](https://angular.io/)
* [ngrx](https://ngrx.github.io/)
* [angular-ngrx-starter](https://github.com/Angular-RU/angular-ngrx-starter)
