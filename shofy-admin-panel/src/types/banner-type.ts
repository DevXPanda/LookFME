export interface IBanner {
  _id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  redirectLink: string;
  image: string;
  imageMobile: string;
  bannerType: "homepage_hero" | "homepage_secondary" | "other";
  order: number;
  isEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBannerForm {
  title: string;
  subtitle: string;
  buttonText: string;
  redirectLink: string;
  image: string;
  imageMobile: string;
  bannerType: "homepage_hero" | "homepage_secondary" | "other";
  order: number;
  isEnabled: boolean;
}
