// intl date 함수 테스트 해보기
const date = new Date();

// 한국 스타일 날짜 뽑아내기
const a = new Intl.DateTimeFormat('kr').format(date);
console.log(a);

// 날짜 시간까지 표시해 주기
const b = new Intl.DateTimeFormat('kr', { dateStyle: 'full', timeStyle: 'full' }).format(date);
console.log(b);

// 시간 차 표현하기 10일 전
const c = new Intl.RelativeTimeFormat().format(-10, 'days');
console.log(c);

// 시간 차 표현하기 5시간 전
const d = new Intl.RelativeTimeFormat().format(-5, 'hours');
console.log(d);

// 라이브러리를 사용하지 않고 지나간 날짜를 나타내는 함수를 만들어 보자
// 시간 단위 체크
const checkTime = {
  isSecond: (time) => time < 60000,
  isMinute: (time) => 60000 <= time && time < 3600000,
  isHour: (time) => 3600000 <= time && time < 86400000,
  isDay: (time) => 86400000 <= time && time < 2592000000,
  isOverOneMonth: (time) => 2592000000 <= time,
};

const calcTime = {
  second: (time) => Math.floor(time / 1000),
  minute: (time) => Math.floor(time / 60000),
  hour: (time) => Math.floor(time / 3600000),
  day: (time) => Math.floor(time / 86400000),
};

// default lang = ko 한국
// default numeric = always 1일 전, 2일 전, auto 어제, 그저께
const generateTimeToString = (time, lang = 'ko', numeric = 'always') => {
  const formatter = new Intl.RelativeTimeFormat(lang, {
    numeric: numeric,
  });
  const passed = new Date() - new Date(time);
  // 조건 추가
  if (checkTime.isSecond(passed)) {
    // 초 단위
    return formatter.format(-calcTime.second(passed), 'second');
  }
  if (checkTime.isMinute(passed)) {
    // 분 단위
    return formatter.format(-calcTime.minute(passed), 'minute');
  }
  if (checkTime.isHour(passed)) {
    // 시간 단위
    return formatter.format(-calcTime.hour(passed), 'hour');
  }
  if (checkTime.isDay(passed)) {
    // 일 단위
    return formatter.format(-calcTime.day(passed), 'day');
  }
  if (checkTime.isOverOneMonth(passed)) {
    // yyyy년 mm월 dd일
    return new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(time));
  }
};

// 테스트
// 1초 전이 나오는지 확인
const second = new Date();
second.setSeconds(second.getSeconds() - 1);
console.log(generateTimeToString(second)); // 1분 미만

// 1분전이 나오는지 확인
const minute = new Date();
minute.setMinutes(minute.getMinutes() - 1);
console.log(generateTimeToString(minute)); // 1시간 미만

// 어제가 나오는지 확인
const yesterday = new Date();
yesterday.setHours(yesterday.getHours() - 24);
console.log(generateTimeToString(yesterday, 'ko', 'auto')); // 1달 미만
