"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  ArrowRight,
  Star,
  MapPin,
  Crown,
  Building2,
  Heart,
  ArrowUpRight,
} from "lucide-react";

// ============================================
// 3-COLOR SCHEME ONLY (No white)
// ============================================
const TEAL = "#019586";
const GREEN = "#00B777";
const MINT = "#B1F1E9";
const DARK = "#072A26";

// ============================================
// SAFE IMAGE HELPER
// ============================================
const getSafeImg = (img) => {
  if (!img) return null;
  if (typeof img === "string" && img.trim() !== "") return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return null;
};

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

// ============================================
// STATUS DOT COLOR
// ============================================
const getStatusDotColor = (status) => {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "available":
      return "bg-emerald-400";
    case "sold":
      return "bg-red-400";
    case "rented":
      return "bg-amber-400";
    case "pending":
      return "bg-yellow-400";
    case "new":
      return GREEN;
    default:
      return TEAL;
  }
};

const getStatusText = (status) => {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "available":
      return "Available";
    case "sold":
      return "Sold";
    case "rented":
      return "Rented";
    case "new":
      return "New";
    default:
      return status || "Available";
  }
};

export default function HeroSection() {
  /* ============================================================
     SLIDER IMAGES (5 hero images)
  ============================================================ */
  const heroImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
  ];

  /* ============================================================
     REAL PROPERTIES (fetched from API)
  ============================================================ */
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedIds, setLikedIds] = useState(new Set());
  const totalImages = heroImages.length;

  // Fetch top 2 featured/latest properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setPropertiesLoading(true);
        const res = await axios.get(
          "/api/properties/get-all?page=1&limit=2&sortBy=isFeatured&sortOrder=desc"
        );
        const data = res.data?.data || [];
        setProperties(data.slice(0, 2));
      } catch {
        setProperties([]);
      } finally {
        setPropertiesLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }, 3500);
    return () => clearInterval(interval);
  }, [totalImages]);

  const toggleLike = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* ============================================================
     PROPERTY CARD (Hero Version — Clean & Simple Layout)
  ============================================================ */
  const HeroPropertyCard = ({ property, index }) => {
    const img =
      getSafeImg(property.thumbnail) ||
      getSafeImg(property.images?.[0]) ||
      PLACEHOLDER;
    const isLiked = likedIds.has(property._id);

    return (
      <Link
        href={`/properties/${property._id}`}
        className="group relative flex h-full flex-1 flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: `0 20px 50px -15px ${TEAL}30`,
          border: `1px solid ${TEAL}20`,
        }}
      >
        {/* Image Area (65% height to fill the space nicely) */}
        <div className="relative h-[65%] w-full overflow-hidden">
          <Image
            src={img}
            alt={property.title || "Property"}
            fill
            loading={index === 0 ? "eager" : "lazy"}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="260px"
          />

          {/* Like button */}
          <button
            onClick={(e) => toggleLike(property._id, e)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all hover:scale-110"
            style={{
              backgroundColor: "#FFFFFFAA",
              border: `1px solid ${TEAL}30`,
            }}
          >
            <Heart
              size={14}
              className={isLiked ? "fill-red-400 text-red-400" : ""}
              style={!isLiked ? { color: TEAL } : undefined}
            />
          </button>

          {/* Arrow up right on hover */}
          <div
            className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-xl opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2"
            style={{
              backgroundColor: TEAL,
              color: "#FFFFFF",
              boxShadow: `0 4px 12px ${GREEN}40`,
            }}
          >
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </div>
        </div>

        {/* Text Content Area */}
        <div className="flex flex-1 flex-col justify-center px-4 py-4">
          <span
            className="truncate text-sm font-extrabold"
            style={{ color: DARK }}
          >
            {property.title || "Untitled Property"}
          </span>

          <span
            className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium"
            style={{ color: TEAL }}
          >
            <MapPin size={11} className="shrink-0" style={{ color: GREEN }} />
            <span className="truncate">
              {property.location || property.city || "Location"}
            </span>
          </span>

          {/* Status pill */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${TEAL}15`,
                color: TEAL,
                border: `1px solid ${TEAL}25`,
              }}
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${getStatusDotColor(property.status)}`}
              />
              {getStatusText(property.status)}
            </span>
            {property.propertyCode && (
              <span
                className="rounded-md px-1.5 py-0.5 font-mono text-[9px] font-bold"
                style={{
                  color: GREEN,
                  backgroundColor: `${GREEN}15`,
                }}
              >
                {property.propertyCode}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  /* ============================================================
     LOADING SKELETON CARD
  ============================================================ */
  const CardSkeleton = () => (
    <div
      className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl animate-pulse"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div
        className="h-[65%] w-full"
        style={{ backgroundColor: `${TEAL}10` }}
      />
      <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-4">
        <div
          className="h-4 rounded w-3/4"
          style={{ backgroundColor: `${TEAL}15` }}
        />
        <div
          className="h-3 rounded w-1/2"
          style={{ backgroundColor: `${TEAL}15` }}
        />
      </div>
    </div>
  );

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden text-[#072A26]"
      style={{ backgroundColor: MINT }}
    >
      {/* ==== TOP GRADIENT ADDED WITH #019586 ==== */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-150"
        style={{
          background: `linear-gradient(to bottom, ${TEAL} 0%, transparent 100%)`,
          opacity: 0.75,
        }}
      />

      <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
        {/* ============ LEFT : TEXT (VERTICALLY CENTERED) ============ */}
        <div className="relative z-20 flex w-full flex-1 flex-col justify-center px-6 pt-16 pb-8 sm:px-10 sm:pt-20 sm:pb-10 md:pt-0 md:py-32 lg:w-[44%] lg:flex-none lg:py-25 lg:pl-14 lg:pr-8">
          {/* Tag pill */}
          <span
            className="w-fit rounded-full px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] shadow-md sm:text-[11px]"
            style={{
              backgroundColor: TEAL,
              color: MINT,
            }}
          >
            ( Find Your Place )
          </span>

          {/* Main Heading */}
          <h1 className="mt-6 text-[40px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl md:text-6xl xl:text-[58px]">
            <span style={{ color: DARK }}>Discover Your</span>
            <br />
            <span style={{ color: TEAL }}>
              Dream Home
            </span>{" "}
            <span style={{ color: DARK }}>Today</span>
          </h1>

          {/* Divider (Solid Color) */}
          <div
            className="mt-8 h-0.75 w-24 sm:w-32 md:w-36 rounded-full"
            style={{ backgroundColor: TEAL }}
          />

          {/* Paragraph */}
          <p
            className="mt-6 sm:mt-8 max-w-[320px] sm:max-w-90 md:max-w-100 text-justify text-[13px] font-medium leading-6 sm:text-sm"
            style={{ color: `${DARK}CC` }}
          >
            Handpicked properties in prime locations — built for comfort, luxury,
            and everyday living.
          </p>

          {/* CTA row */}
          <div className="mt-8 sm:mt-9 flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/properties"
              className="group flex w-fit items-center gap-3 sm:gap-4 rounded-full py-2.5 pl-6 sm:pl-7 pr-2 sm:pr-2.5 shadow-[0_12px_30px_-10px_rgba(1,149,134,0.6)] transition-all duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: TEAL,
                color: "#FFFFFF",
              }}
            >
              <span className="text-xs sm:text-sm font-extrabold">View Properties</span>
              <span
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: TEAL,
                }}
              >
                <ArrowRight size={14} strokeWidth={2.5} className="sm:hidden" />
                <ArrowRight size={16} strokeWidth={2.5} className="hidden sm:block" />
              </span>
            </Link>

            <Link
              href="/contact"
              className="border-b-2 pb-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] transition-colors"
              style={{
                color: TEAL,
                borderColor: `${TEAL}50`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = GREEN;
                e.currentTarget.style.borderColor = GREEN;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = TEAL;
                e.currentTarget.style.borderColor = `${TEAL}50`;
              }}
            >
              ( Book A Visit )
            </Link>
          </div>

          {/* Social proof */}
          <Link
            href="/testimonials"
            className="group mt-8 sm:mt-9 flex w-fit items-center gap-3 sm:gap-4"
          >
            <div className="flex -space-x-2 sm:-space-x-3">
              {heroImages.slice(0, 3).map((src, i) => (
                <div
                  key={i}
                  className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-full shadow-md"
                  style={{ border: `2px solid #FFFFFF` }}
                >
                  <Image
                    src={src}
                    alt={`Happy homeowner ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span
                className="flex items-center gap-1 text-xs sm:text-sm font-extrabold"
                style={{ color: DARK }}
              >
                4.9 <Star size={12} className="fill-[#FFC107] text-[#FFC107] sm:hidden" />
                <Star size={14} className="fill-[#FFC107] text-[#FFC107] hidden sm:block" />
              </span>
              <span className="text-[10px] sm:text-xs" style={{ color: `${DARK}A0` }}>
                12k+ happy homeowners
              </span>
            </div>
            <span
              className="ml-1 border-b-2 border-transparent pb-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.18em] transition-colors group-hover:border-[#FFC107]"
              style={{ color: TEAL }}
            >
              ( Testimonials )
            </span>
          </Link>
        </div>

        {/* ============ RIGHT : PROPERTY GALLERY ============ */}
        {/* Mobile/Tablet: Visible and stacked below text */}
        {/* Desktop: Absolute positioned with overlap */}
        <div className="relative w-full flex-1 md:hidden">
          {/* Mobile/Tablet Gallery Layout */}
          <div className="relative w-full h-150 sm:h-170 px-6 pb-10 sm:px-10">
            {/* Main Slider */}
            <div className="relative h-[55%] w-full mb-5 sm:mb-6">
              <div
                className="group relative h-full w-full overflow-hidden rounded-2xl"
                style={{
                  boxShadow: `0 30px 70px -20px ${TEAL}40`,
                  border: `1px solid #FFFFFF50`,
                }}
              >
                {heroImages.map((img, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Property exterior ${index + 1}`}
                      fill
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="object-cover transition-transform duration-2000 group-hover:scale-105"
                      sizes="100vw"
                    />
                  </div>
                ))}

                {/* Floating badge */}
                <div
                  className="absolute right-4 top-4 flex items-center gap-2 rounded-full px-3 py-1.5 shadow-lg backdrop-blur-md sm:right-5 sm:top-5 sm:px-4 sm:py-2"
                  style={{
                    backgroundColor: `${MINT}E6`,
                    color: TEAL,
                  }}
                >
                  <span
                    className="h-2 w-2 animate-pulse rounded-full"
                    style={{ backgroundColor: GREEN }}
                  />
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.15em]">
                    250+ New Listings
                  </span>
                </div>

                {/* Building icon */}
                <div
                  className="absolute left-4 bottom-4 flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-md sm:left-5 sm:bottom-5 sm:px-4 sm:py-2"
                  style={{
                    backgroundColor: `${TEAL}E6`,
                    color: MINT,
                  }}
                >
                  <Building2 size={14} />
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.15em]">
                    Premium Listings
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-6">
              <span className="text-base sm:text-lg font-extrabold" style={{ color: TEAL }}>
                {String(currentImageIndex + 1).padStart(2, "0")}
              </span>
              <div
                className="relative h-0.75 w-28 sm:w-40 overflow-hidden rounded-full"
                style={{ backgroundColor: "#014D41" }}
              >
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentImageIndex + 1) / totalImages) * 100}%`,
                    backgroundColor: "#FFFFFF",
                  }}
                />
              </div>
              <span className="text-base sm:text-lg font-extrabold" style={{ color: TEAL }}>
                {String(totalImages).padStart(2, "0")}
              </span>
            </div>

            {/* Property Cards */}
            <div className="flex h-[calc(45%-60px)] gap-3 sm:gap-4">
              {propertiesLoading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : properties.length > 0 ? (
                properties.map((p, i) => (
                  <HeroPropertyCard key={p._id} property={p} index={i} />
                ))
              ) : (
                <>
                  <div
                    className="flex h-full flex-1 flex-col rounded-2xl"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: `1px solid ${TEAL}20`,
                    }}
                  >
                    <div className="flex flex-1 flex-col justify-center items-center px-4">
                      <Building2 size={32} style={{ color: TEAL }} />
                      <span className="mt-3 text-sm font-extrabold text-center" style={{ color: DARK }}>
                        No Properties Available
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex h-full flex-1 flex-col rounded-2xl"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: `1px solid ${TEAL}20`,
                    }}
                  >
                    <div className="flex flex-1 flex-col justify-center items-center px-4">
                      <Crown size={32} style={{ color: GREEN }} />
                      <span className="mt-3 text-sm font-extrabold text-center" style={{ color: DARK }}>
                        Featured Soon
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Gallery Layout (md and above) - Original Design */}
        <div className="relative hidden md:block md:h-160 lg:h-auto lg:flex-1 lg:ml-[-10%]">
          {/* ---------- MAIN LARGE IMAGE (top + side margins) ---------- */}
          <div className="absolute left-0 right-4 bottom-16 top-16 md:right-6 md:top-20 lg:bottom-20 lg:top-24">
            <div
              className="group relative h-full w-full overflow-hidden rounded-tl-[200px] lg:rounded-tl-[300px] rounded-2xl"
              style={{
                boxShadow: `0 30px 70px -20px ${TEAL}40`,
                border: `1px solid #FFFFFF50`,
              }}
            >
              {heroImages.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Property exterior ${index + 1}`}
                    fill
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-2000 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 64vw"
                  />
                </div>
              ))}

              {/* Floating badge */}
              <div
                className="absolute right-4 top-4 md:right-5 md:top-5 flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 shadow-lg backdrop-blur-md"
                style={{
                  backgroundColor: `${MINT}E6`,
                  color: TEAL,
                }}
              >
                <span
                  className="h-2 w-2 animate-pulse rounded-full"
                  style={{ backgroundColor: GREEN }}
                />
                <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.15em]">
                  250+ New Listings
                </span>
              </div>

              {/* Building icon */}
              <div
                className="absolute left-4 bottom-4 md:left-5 md:bottom-5 flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 backdrop-blur-md"
                style={{
                  backgroundColor: `${TEAL}E6`,
                  color: MINT,
                }}
              >
                <Building2 size={14} />
                <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.15em]">
                  Premium Listings
                </span>
              </div>
            </div>
          </div>

          {/* ---------- 2 REAL PROPERTY CARDS ---------- */}
          <div className="absolute bottom-20 right-4 top-[52%] z-10 flex w-[80%] gap-3 pl-3 md:bottom-24 md:right-8 md:w-[58%] md:gap-5 md:pl-6">
            {propertiesLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : properties.length > 0 ? (
              properties.map((p, i) => (
                <HeroPropertyCard key={p._id} property={p} index={i} />
              ))
            ) : (
              <>
                <div
                  className="flex h-full flex-1 flex-col rounded-2xl"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${TEAL}20`,
                  }}
                >
                  <div className="flex flex-1 flex-col justify-center items-center px-4">
                    <Building2 size={32} style={{ color: TEAL }} />
                    <span className="mt-3 text-sm font-extrabold text-center" style={{ color: DARK }}>
                      No Properties Available
                    </span>
                  </div>
                </div>
                <div
                  className="flex h-full flex-1 flex-col rounded-2xl -mr-10"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${TEAL}20`,
                  }}
                >
                  <div className="flex flex-1 flex-col justify-center items-center px-4">
                    <Crown size={32} style={{ color: GREEN }} />
                    <span className="mt-3 text-sm font-extrabold text-center" style={{ color: DARK }}>
                      Featured Soon
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ---------- BOTTOM BAR : 01 —— 05 (White Color) ---------- */}
          <div className="absolute inset-x-0 bottom-0 flex h-14 items-center pr-5 md:h-16 md:pr-10">
            <div className="flex items-center gap-3 md:gap-4 pl-1">
              <span className="text-base md:text-lg font-extrabold" style={{ color: TEAL }}>
                {String(currentImageIndex + 1).padStart(2, "0")}
              </span>
              <div
                className="relative h-0.75 w-32 md:w-40 lg:w-56 overflow-hidden rounded-full"
                style={{ backgroundColor: "#014D41" }}
              >
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentImageIndex + 1) / totalImages) * 100}%`,
                    backgroundColor: "#FFFFFF",
                  }}
                />
              </div>
              <span className="text-base md:text-lg font-extrabold" style={{ color: TEAL }}>
                {String(totalImages).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}