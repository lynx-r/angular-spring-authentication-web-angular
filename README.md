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

# Пример аутентификации без фреймворков для аутентификации на Angular и Spring

## Что вы изучите

Вы изучите как создать сайт с собственной аутентификации без использования сторонних библиотек и фреймворков для аутентификации. Здесь будут рассмотрены приложения на Angular и Spring [Репозиторий клиента на Angular](https://github.com/lynx-r/angular-spring-authentication-web-angular) [Репозиторий сервера на Spring](https://github.com/lynx-r/angular-spring-authentication-server-spring).
<cut/>

# Сервер аутентификации на Spring

## Структура проекта

    .
    └── backendspring
        ├── BackendspringApplication.java           # Spring приложение
        ├── config
        │   ├── AppProperties.java
        │   ├── AuthAuthority.java                  # Описание доступов для контроллера авторизации пользователей
        │   ├── CorsFilterAdapter.java              # Описание CORS
        │   ├── ErrorMessages.java
        │   ├── IAuthority.java                     # Интерфейс для описания доступов
        │   ├── RequestConstants.java
        │   ├── SecuredAuthority.java               # Описание доступов для защищенного контроллера
        │   └── SecurityConfig.java                 # Конфигурация CORS через Spring Security
        ├── controller
        │   ├── AuthController.java                 # Контроллер аутентификации
        │   └── ProtectedPingPongController.java    # Защищенный контроллер
        ├── dao
        │   ├── BaseDao.java
        │   └── SecureUserDao.java                  # DAO для хранящегося в базе информации о пользователе
        ├── exception
        │   ├── AuthException.java
        │   └── PingPongException.java
        ├── function
        │   ├── BaseHandlerFunc.java                # Рутинные методы аутентификации для функционального интерфейса ModelHandlerFunc.java
        │   ├── TrustedHandlerFunc.java             # Функциональный интерфейс обрабатывающий проверенные запросы клиента
        │   └── SecureHandlerFunc.java              # Функциональный интерфейс выполняющий проверку запросов клиента
        ├── model
        │   ├── Answer.java                         # Структура данных - ответ сервера
        │   ├── AuthUser.java                       # Данные о пользователе используемые для его аутентификации
        │   ├── BaseDomain.java
        │   ├── EnumAuthority.java                  # Enum с описание доступов на сайт
        │   ├── MessagePayload.java
        │   ├── MessageResponse.java
        │   ├── Payload.java                        # Интерфейс с описание классов для сериализации/десериализации в JSON
        │   ├── PingPayload.java                    # Данные, которые получаем от клиента
        │   ├── PongPayload.java                    # Данные, которые возвращаем клиенту
        │   ├── RegisterUser.java                   # Информация для регистрации/аутентифкации пользователя
        │   └── SecureUser.java                     # Хранимая в БД информация о пользователе
        └── service
            ├── PingPongService.java                # Сервис, которые обрабатывает запрос клиента и возвращает данные ответа
            ├── SecureUserService.java              # Собственно, сервис в котором производится аутентификация/авторизация
            └── SecureUtils.java                    # Сервис для шифрования данных пользователя
    
    8 directories, 32 files

## SecureUserService.java

Это основной сервис этой статьи. В нем реализованы следующие методы:

`public Optional<AuthUser> register(RegisterUser registerUser);` - Регистрация пользователя;

`public Optional<AuthUser> authorize(RegisterUser registerUser);` - Авторизация/Логин пользователя;

`public Optional<AuthUser> authenticate(AuthUser authUser);` - Аутентификация/Проверка прав пользователя;

`public Optional<AuthUser> logout(AuthUser authUser);` - Выход/Удаление информации о том, что пользователь сейчас на сайте.

Приведу код авторизации пользователя:

```
// Берем хеш учетных данных пользователя
String credentials = registerUser.getCredentials();
String salt = secureUser.getSalt();
String clientDigest = SecureUtils.digest(credentials + salt);

// Сверяем с теми что хранятся в базе данных
if (clientDigest.equals(secureUser.getDigest())) {
  // Получаем зашифрованный AccessToken
  TokenPair accessToken = getAccessToken(secureUser);
  
  // Присваиваем пользователю сессию
  String userSession = getUserSession();
  // Сохраняем AccessToken и сессию
  secureUser.setSecureToken(accessToken.secureToken);
  secureUser.setAccessToken(accessToken.accessToken);
  secureUser.setUserSession(userSession);
  secureUserDao.save(secureUser);

  // Возвращем AccessToken, открытые данные пользователя и сессию клиенту
  String userId = secureUser.getId();
  Set<EnumAuthority> authorities = secureUser.getAuthorities();
  AuthUser authUser = AuthUser.simpleUser(userId, username, accessToken.accessToken, userSession, authorities);
  return authUser;
```

В общем, стандартный алгоритм, которые применяется довольно давно.

Да, для получения AccessToken’а я не использую ничего из данных пользователя. Просто беру рандомную строку и шифрую её встроенными алгоритмами шифрования Java.

## Контроллер авторизации клиента (AuthController)

Для формирования ответа клиенту я использовал способ описанный раннее в [этой статье](https://habr.com/post/352732/)

В этом примере были произведены некоторые упрощения. Но, здесь, все так же используется функциональные интерфейсы:

Приведу пример того, как выглядит создание ответа при авторизации:

```
@PostMapping("authenticate")
public @ResponseBody
Answer authenticate(@RequestBody AuthUser registerUser, HttpServletResponse response) {
  // обрабатываем не авторизованные запрос на аутентификацию
  return ((TrustedHandlerFunc<AuthUser>) (data) ->
      secureUserService.authenticate(data)
          .map(Answer::ok)
          .orElseGet(Answer::forbidden))
      .handleAuthRequest(response, registerUser);
}
```

Для обработки не авторизованных запросов я использую функциональный интерфейс `TrustedHandlerFunc`. Он содержит в себе метод `Answer process(T data);`. Этот метод реализуется в контроллере и в нём выполняется вызов описанного выше сервиса `SecureUserService`. Ответ этого сервися отображается на метод `Answer::ok` в случае успешной авторизации или метод `Answer::forbidden` в случае неудачной авторизации. Оба метода формируют соответствующие тела ответа. В первом случае телом ответа будет результат выполнения метода сервиса `SecureUserService::authorize` - `AuthUser`. Во втором, случае будет сообщение `MessageResponse`. Также в данном интерфейсе есть метод по умолчанию `TrustedHandlerFunc::handleRequest` и `TrustedHandlerFunc::handleAuthRequest`, который выбирают для метода `Answer process(T data);` данные. При этом, первый метод предполагает наличие проверенного токена, а второй используется для авторизации.

## Контроллер обработки запросов клиента (ProtectedPingPongController)

Этот контроллер, как вы привыкли видеть, обрабатывает запросы пользователя через сервис `PingPongService`.

Приведу пример создания ответа на запрос `ping`:

```
@PostMapping("ping")
public @ResponseBody
Answer ping(@RequestBody PingPayload ping, HttpServletRequest request, HttpServletResponse response) {
  return ((SecureHandlerFunc) authUser ->
      secureUserService.authenticate(authUser) // Авторизуем пользователя
  ).getAuthUser(request, SecuredAuthority.PING)
      .map(authUser -> // получаме авторизованного пользователя
          ((TrustedHandlerFunc<PingPayload>) (data) ->
              pingPongService.getPong(data, authUser) // обрабатываем запрос пользователя в сервисе
                  .map(Answer::ok)
                  .orElseGet(Answer::forbidden)
          ).handleRequest(response, ping, authUser) // обрабатываем запрос
      ).orElseGet(Answer::forbidden);
}
```

Здесь используются два функциональных интерфейса: `SecureHandlerFunc` и `TrustedHandlerFunc`. Первый проверяет пользовательские заголовки, пришедшие с клиента, создает из них "token" AuthUser и передаёт их в следующую функцию `TrustedHandlerFunc`. В ней ожидается, что её вызывает авторизованный пользователь.

Детали реализации этих интерфейсов я приводить не буду, так как они описаны в статье, ссылка на которую, была приведена ранее. Скажу лишь, что отличие только в разбиение полномочий на авторизацию и создание ответа клиенту.

## Не обошлось без Spring Security

Нужно отметить, что всё же пришлось обратиться к помощи Spring Security для корректной обработки CORS.

Для добавления соответствующих заголовков был использован код с StackOverflow. Он находится в классах `CorsFilterAdapter` и `SecurityConfig`.

## Вывод

В этой статье мы рассмотрели как сделать простую аутентификацию "своими руками" почти без использования специализированных фреймворков.
