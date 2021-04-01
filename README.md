## 맘시터 과제전형

Nest를 활용한 백엔드 서버 구축

### 사용 기술

- ramework : [Nestjs](https://nestjs.com/)
- Base language : [Typescript](https://www.typescriptlang.org/)
- Server : [apollo](https://github.com/apollographql/apollo-server)
- ORM : [typeorm](https://typeorm.io/#/)
- DB : [postgreSQL](https://www.postgresql.org/)

### 추가 설치 라이브러리

- [bcrypt](https://www.npmjs.com/package/bcrypt) : 비밀번호 해쉬 패키지
- [joi](https://www.npmjs.com/package/joi) : 환경 변수 검증을 위해 사용
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) : jwt 생성 및 인증을 위해 사용
- [class-transformer](https://github.com/typestack/class-transformer) : 엔티티 유효성 검증
- [class-validator](https://github.com/typestack/class-validator) : 엔티티 유효성 검증
- [cross-env](https://www.npmjs.com/package/cross-env) : 환경 변수 관리

### 코드 실행 및 api 테스트 방법

- 패키지 설치 후, cp 명령어로 env 파일 복사
- 현재 임시 키 값을 넣어놨으므로, `.env.dev`에 `DB_NAME` `DB_USERNAME` `DB_PASSWORD` 값만 넣어주면 됩니다.
- 앱 실행 시 테이블은 자동으로 생성됩니다. (`User` 테이블과 `Child` 테이블)
- 플레이그라운드에서 생성된 쿼리와 뮤테이션 명세 확인 및 api 테스트가 가능합니다. 예시 :`https://hocalhost:3000/graphql`
- `createAccountOfParent` `createAccountOfSitter` `login` 뮤테이션 외에는 `token`이 필요하므로, 플레이그라운드 하단의 `HTTP HEADERS`에 로그인 실행 후 받아온 token 값을 넣어주어야 합니다. 토큰의 키값은 반드시 `jwt`여야만 합니다.
- 예시
  ![image](https://user-images.githubusercontent.com/58724686/113241893-96817080-92ea-11eb-8447-79db7553572b.png)

```tsx
npm i
cp .env.sample .env.dev
```

### DB 테이블

#### 유저 테이블

- `Child` 테이블과 `OneToMany` 관계

  | Name               | Type   | required | Constraint       | Description           |
  | ------------------ | ------ | -------- | ---------------- | --------------------- |
  | id                 | number | yes      | Primary key      |                       |
  | created_at         | Date   | yes      | Not Null         |                       |
  | updated_at         | Date   | yes      | Not Null         |                       |
  | member_number      | number | yes      | Unique, Not Null | 회원번호 자동생성     |
  | name               | string | yes      | Not Null         | 회원 이름             |
  | birthday           | Date   | yes      | Not Null         | 생년원일              |
  | gender             | enum   | yes      | Not Null         | 성별                  |
  | account_id         | number | yes      | Unique, Not Null | 회원가입 아이디       |
  | password           | string | yes      | Not Null         | 비밀번호              |
  | email              | string | yes      | Not Null         | 이메일                |
  | roles              | enum   | yes      | Not Null         | 회원 역할             |
  | parent_description | string |          |                  | 부모 역할만 생성가능  |
  | sitter_description | string |          |                  | 시터 역할만 생성 가능 |
  | care_range         | enum   |          |                  | 시터 역할만 생성 가능 |

#### 아이 테이블

- `User` 테이블과 `ManyToOne` 관계

| Name       | Type   | required | Constraint  | Description       |
| ---------- | ------ | -------- | ----------- | ----------------- |
| id         | number | yes      | Primary key |                   |
| created_at | Date   | yes      | Not Null    |                   |
| updated_at | Date   | yes      | Not Null    |                   |
| birthday   | Date   | yes      | Not Null    | 생년월일          |
| gender     | enum   | yes      | Not Null    | 성별              |
| parentId   | number | yes      | Not Null    | `User`와 릴레이션 |

### 쿼리

`me`

- 리턴 타입 : 유저 엔티티의 모든 필드
- 로그인한 누구나 쿼리 요청 가능

`userProfile`

- 인풋 타입 : 유저 Id
- 리턴 타입 : 유저 엔티티의 필드와 성공 여부를 가진 객체
- 로그인한 누구나 쿼리 가능

### 뮤테이션

`createAccountOfParent`

- 인풋 타입 : `User` 엔티티의 필수 필드와 `child`엔티티 필드, 추가로 부모 역할을 위한 `parentDescription` 필드
- 리턴 타입 : 성공 여부 객체
- 권한 검사 없이 뮤테이션 요청 가능

`createAccountOfSitter`

- 인풋 타입 : `User` 엔티티의 필수 필드와 시터 역할을 위한 `careRange`와 `parentDescription` 필드
- 리턴 타입 : 성공 여부 객체
- 권한 검사 없이 뮤테이션 요청 가능

`login`

- 인풋 타입 : `accountId`와 `password`
- 리턴 타입 : 성공 여부 객체와 `jwt` 토큰 반환
- 권한 검사 없이 뮤테이션 요청 가능

`updateProfile`

- 인풋 타입 : 업데이트를 원하는 유저 객체의 필드, `http header`에 jwt 토큰 넣어주어야 함
- 리턴 타입 : 성공 여부 객체
- `jwt` 토큰 기반 로그인된 유저는 누구나 요청 가능

`changePassword`

- 인풋 타입 : 변경할 패스워드, `http header`에 jwt 토큰 넣어주어야 함
- 리턴 타입 : 성공 여부 객체
- 비고 : 비밀번호는 생성과 업데이트 전에 비밀번호 정책 검사 후, 해쉬 함수를 적용
- `jwt` 토큰 기반 로그인된 유저는 누구나 요청 가능

`addParentRole`

- 인풋 타입 : 부모 역할로서의 요청사항, `Child` 엔티티 필드
- 리턴 타입 : 성공 여부 객체
- 비고 : 내부에서 실제 `roles` 필드에 들어있는 값을 확인해서 이미 모든 역할을 가지고 있다면 요청을 취소함
- `jwt` 토큰 기반 로그인된 유저 중 오직 `Sitter` 역할만 요청 가능

`addSitterRole`

- 인풋 타입 : 시터 역할로서의 자기 소개 및 케어 가능 범위
- 리턴 타입 : 성공 여부 객체
- 비고 : 내부에서 실제 `roles` 필드에 들어있는 값을 확인해서 이미 모든 역할을 가지고 있다면 요청을 취소함
- `jwt` 토큰 기반 로그인된 유저 중 오직 `Parent` 역할만 요청 가능

`updateChildInfo`

- 인풋 타입 : 변경하고자 하는 `Child` 엔티티 필드
- 리턴 타입 : 성공 여부 객체
- 비고 : 부모는 여러 아이를 가질 수 있지만, 현재 모든 아이의 정보를 한번에 변경하지 못함
- `jwt` 토큰 기반 로그인된 유저 중 오직 `Parent` 역할을 가지고 있는 유저만 요청 가능

#### 기타 사항

- `User` 엔티티와 `Child` 엔티티의 릴레이션이 매끄럽지 못하여, `User` 엔티티를 통한 `Child` 엔티티의 생성과 수정에 리팩토링이 필요함
- 에러 처리는 `error` 객체를 반환하기 보다, 제어할 수 있는 부분은 `text` 메시지로 처리하고자 했음
