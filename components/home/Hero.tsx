import Link from "next/link";
import { RingStage } from "./RingStage";

export function Hero() {
  return (
    <section className="hero">
      <RingStage />
      <div className="wrap hero__top">
        <p className="lead">Загрузи фото вещи. Эксперт изучит бирки, швы и&nbsp;фурнитуру и&nbsp;ответит: оригинал или реплика.</p>
        <div className="hero__cta">
          <Link className="btn btn--lg" href="/new/">Начать проверку</Link>
          <Link className="textbtn" href="/catalog/">Смотреть проверки</Link>
        </div>
      </div>
      <h1 className="hero__h1 d wrap">
        <span className="hero__l"><span>Проверка</span> <span>подлинности</span></span>{" "}
        <span className="hero__l"><span>брендовых</span> <span>вещей</span></span>
      </h1>
    </section>
  );
}
