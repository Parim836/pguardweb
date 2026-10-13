import {
  ChevronLeft,
  MapPin,
  Navigation,
  Car,
  Bike,
  Footprints,
  Check,
  X,
  ChevronRight,
  Shield,
  UserSearch,
} from "lucide-react";
import mapImage from "./Phone/map.png";
import { useId, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useLanguage } from "../LanguageContext";
import "./styles/HeroPhone.css";

export default function HeroPhone() {
  const { language } = useLanguage();
  const th = language === "TH";
  const shadowId = useId();
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const device = stage.querySelector<HTMLElement>(".hero-phone-device")!;
      const screen = stage.querySelector<HTMLElement>(".hero-phone-screen")!;
      const front = stage.querySelector<HTMLElement>(".hero-floating-screen--front")!;
      const middle = stage.querySelector<HTMLElement>(".hero-floating-screen--middle")!;
      const shadows = stage.querySelectorAll(".hero-phone-floor-shadow, .hero-phone-contact-shadow");
      const pose = (element: HTMLElement) => {
        const style = getComputedStyle(element);
        return { left: style.left, top: style.top, transform: style.transform };
      };
      const devicePose = pose(device);
      const frontPose = pose(front);
      const middlePose = pose(middle);
      const matrix = new DOMMatrix(devicePose.transform);
      const origin = new DOMPoint(6, 6).matrixTransform(matrix);
      const cardStart = (card: HTMLElement) => ({
        left: parseFloat(devicePose.left) + origin.x,
        top: parseFloat(devicePose.top) + origin.y,
        transform: matrix.scale(screen.clientWidth / card.offsetWidth, screen.clientHeight / card.offsetHeight).toString(),
        borderRadius: "30px",
        boxShadow: "0 0 0 transparent",
      });
      const overlay = (source: Element) => {
        const copy = source.cloneNode(true) as HTMLElement;
        copy.classList.add("hero-phone-intro-overlay");
        // Keep SVG references pointing at the original splash's unique gradient.
        copy.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
        screen.append(copy);
        return copy;
      };
      const mode = overlay(middle.firstElementChild!);
      const splash = overlay(front.firstElementChild!);
      const context = gsap.context(() => {
        const frontShadow = getComputedStyle(front).boxShadow;
        const middleShadow = getComputedStyle(middle).boxShadow;
        const introScale = 1.15;
        gsap.set(device, { left: 168, top: 65 - device.offsetHeight * (introScale - 1) / 2, transform: `scale(${introScale})`, "--phone-depth": 0 });
        gsap.set([front, middle, ...Array.from(shadows)], { autoAlpha: 0 });
        const timeline = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
        const heroCopy = stage.closest(".hero-grid")?.querySelector<HTMLElement>(".hero-copy");
        if (heroCopy && window.matchMedia("(min-width: 901px)").matches) {
          const copyBounds = heroCopy.getBoundingClientRect();
          const phoneBounds = device.getBoundingClientRect();
          const gap = 32;
          const pairWidth = copyBounds.width + gap + phoneBounds.width;
          const pairLeft = (document.documentElement.clientWidth - pairWidth) / 2;
          const startX = pairLeft - copyBounds.left;
          const targetPhoneLeft = pairLeft + copyBounds.width + gap;
          const sceneScale = phoneBounds.width / (device.offsetWidth * introScale);
          gsap.set(device, { left: 168 + (targetPhoneLeft - phoneBounds.left) / sceneScale });
          gsap.set(heroCopy, { x: startX });
          timeline.to(heroCopy, { x: 0, duration: 1.3 }, 1.2);
        }
        timeline.to(device, { ...devicePose, "--phone-depth": 1, duration: 1.3 }, 1.2)
          .to(shadows, { autoAlpha: 1, duration: 1 }, 1.6)
          .set(front, { ...cardStart(front), autoAlpha: 1 }, 2.55)
          .set(splash, { autoAlpha: 0 }, 2.55)
          .to(front, { ...frontPose, borderRadius: "27px", boxShadow: frontShadow, duration: 1.4 }, 2.55)
          .set(middle, { ...cardStart(middle), autoAlpha: 1 }, 2.9)
          .set(mode, { autoAlpha: 0 }, 2.9)
          .to(middle, { ...middlePose, borderRadius: "27px", boxShadow: middleShadow, duration: 1.3 }, 2.9)
          .to(front, { y: "-=6", force3D: true, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true }, 4.3)
          .to(middle, { y: "-=4", force3D: true, duration: 3.6, ease: "sine.inOut", repeat: -1, yoyo: true }, 4.9);
        let started = false;
        const start = () => {
          if (started) return;
          started = true;
          timeline.delay(0.7).play();
        };
        window.addEventListener("pguard-intro-complete", start);
        if (document.body.dataset.pguardIntro === "complete") start();
        return () => window.removeEventListener("pguard-intro-complete", start);
      }, stage);
      return () => {
        context.revert();
        splash.remove();
        mode.remove();
      };
    });
    return () => media.revert();
  }, []);
  return (
    <div
      ref={stageRef}
      className="hero-phone-stage"
      role="img"
      aria-label={
        th
          ? "โทรศัพท์ PGUARD กรอบดำ พร้อมตัวอย่างหน้าจอบริการรักษาความปลอดภัย"
          : "Black PGUARD phone showing professional security services"
      }
    >
      <div className="hero-phone-scene" aria-hidden="true">
        <svg
          className="hero-phone-floor-shadow"
          viewBox="0 0 560 630"
          focusable="false"
        >
          <defs>
            <linearGradient
              id={`${shadowId}-fade`}
              x1="240"
              y1="0"
              x2="560"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#080808" stopOpacity="0.82" />
              <stop offset="0.38" stopColor="#101010" stopOpacity="0.56" />
              <stop offset="0.78" stopColor="#181818" stopOpacity="0.26" />
              <stop offset="1" stopColor="#181818" stopOpacity="0" />
            </linearGradient>
            <filter
              id={`${shadowId}-soft`}
              x="-15%"
              y="-100%"
              width="130%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="4 2.5" />
            </filter>
          </defs>
          <path
            d="M 147 552 C 187 552 220 552 240 548 C 263 540 281 536 299 536 C 382 536 469 537 557 539 L 557 546 C 456 550 377 560 308 568 C 254 568 194 560 147 556 Z"
            fill={`url(#${shadowId}-fade)`}
            filter={`url(#${shadowId}-soft)`}
          />
        </svg>
        <div className="hero-phone-contact-shadow" />
        <div className="hero-phone-device">
          <div className="hero-phone-chassis" />
          <i className="hero-phone-antenna hero-phone-antenna--top" />
          <i className="hero-phone-antenna hero-phone-antenna--bottom" />
          <i className="hero-phone-power" />
          <i className="hero-phone-side-insert" />
          <div className="hero-phone-bottom">
            <span className="hero-phone-speaker">
              {Array.from({ length: 5 }, (_, index) => (
                <i key={index} />
              ))}
            </span>
            <i className="hero-phone-charge-port" />
            <span className="hero-phone-speaker">
              {Array.from({ length: 5 }, (_, index) => (
                <i key={index} />
              ))}
            </span>
          </div>
          <div className="hero-phone-bezel">
            <div className="hero-phone-screen">
              <div className="hero-phone-island">
                <i />
              </div>
              <div className="hero-route-map" style={{ backgroundImage: `url(${mapImage})` }}>
                <div className="hero-route-toolbar"><span className="hero-route-back"><ChevronLeft size={17} /></span><span className="hero-route-status"><i />{th ? "กำลังไปจุดนัด" : "On the way"}</span></div>
                <svg className="hero-route-line" viewBox="0 0 212 310" preserveAspectRatio="none"><path d="M 29 64 L 49 71 L 52 78 L 64 84 L 76 82 L 91 89 L 99 105 L 112 119 L 114 135 L 119 146 L 98 194 L 108 225 L 122 231 L 116 250 L 138 283 L 161 293 L 183 297" fill="none" stroke="#25a87d" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /></svg>
                <span className="hero-route-destination"><MapPin size={15} fill="currentColor" /></span><span className="hero-route-location" />
              </div>
              <div className="hero-route-sheet" lang={th ? "th" : "en"}>
                <span className="hero-route-handle" />
                <div className="hero-route-summary"><span className="hero-route-direction"><Navigation size={21} fill="currentColor" /></span><div><strong>{th ? "37.8 กม. 33 นาที" : "37.8 km 33 min"}</strong><p>{th ? "สยาม, ถนนพระรามที่ 1" : "Siam, Rama I Road"}</p></div></div>
                <div className="hero-route-modes"><span className="is-active"><Car size={11} />{th ? "รถยนต์" : "Car"}</span><span><Bike size={11} />{th ? "มอเตอร์ไซค์" : "Bike"}</span><span><Footprints size={11} />{th ? "เดิน" : "Walk"}</span></div>
                <div className="hero-route-arrive">{th ? "ถึงจุดนัดแล้ว" : "I've arrived"}</div>
              </div>
              <div className="hero-phone-glass" />
              <div className="hero-phone-home-bar" />
            </div>
          </div>
        </div>
        <div className="hero-floating-screen hero-floating-screen--middle">
          <div className="hero-mode-screen" lang={th ? "th" : "en"}>
            <div className="hero-mode-toolbar"><X size={14} /><div className="hero-mode-language"><span className={th ? "is-active" : ""}>TH</span><span className={!th ? "is-active" : ""}>EN</span></div></div>
            <div className="hero-mode-illustration"><img src="/images/pguard-mode-reference.jpg" alt="" /></div>
            <h3>{th ? "เลือกโหมด" : "Choose mode"}</h3>
            <p>{th ? "สลับระหว่างเจ้าหน้าที่กับลูกค้า" : "Switch between guard and customer"}</p>
            <div className="hero-mode-option hero-mode-option--active">
              <span className="hero-mode-icon"><Shield size={20} /></span>
              <div className="hero-mode-option-copy"><strong>{th ? "เจ้าหน้าที่ รปภ." : "Security guard"}</strong><small>{th ? "โหมดปัจจุบัน" : "Current mode"}</small></div>
              <span className="hero-mode-badge">{th ? "ปัจจุบัน" : "Current"}</span><ChevronRight size={13} />
            </div>
            <div className="hero-mode-option">
              <span className="hero-mode-icon"><UserSearch size={20} /></span>
              <div className="hero-mode-option-copy"><strong>{th ? "จ้าง รปภ." : "Hire a guard"}</strong><small>{th ? "แตะเพื่อสลับโหมดนี้" : "Tap to switch to this mode"}</small></div>
              <span className="hero-mode-badge">{th ? "พร้อมใช้" : "Available"}</span><ChevronRight size={13} />
            </div>
          </div>
        </div>
        <div className="hero-floating-screen hero-floating-screen--front">
          <div className="hero-floating-splash">
            <div className="hero-splash-identity">
              <svg className="hero-splash-logo" viewBox="0 0 80 104" focusable="false">
                <defs>
                  <linearGradient id={`${shadowId}-shield`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#1ca477" />
                    <stop offset="1" stopColor="#0c4032" />
                  </linearGradient>
                </defs>
                <path d="M40 0 79 14V47C79 72 65 91 40 104 15 91 1 72 1 47V14Z" fill={`url(#${shadowId}-shield)`} />
                <path d="M40 27a16 16 0 0 0-16 16c0 13 16 29 16 29s16-16 16-29a16 16 0 0 0-16-16Zm0 9a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z" fill="#f5fff9" fillRule="evenodd" />
              </svg>
              <div className="hero-splash-wordmark"><span>p</span>guard</div>
              <div className="hero-splash-tagline" lang={th ? "th" : "en"}>
                {th ? "ความปลอดภัย ณ ตำแหน่งจริง" : "Safety at your location"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
