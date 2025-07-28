import type { Schema, Struct } from '@strapi/strapi';

export interface QuestionnaireColorVariant extends Struct.ComponentSchema {
  collectionName: 'components_questionnaire_color_variants';
  info: {
    displayName: 'Color Variant';
  };
  attributes: {
    colorCode: Schema.Attribute.String;
    colorName: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    variationImage: Schema.Attribute.Media<'images'>;
  };
}

export interface QuestionnaireQuestionnaireOptions
  extends Struct.ComponentSchema {
  collectionName: 'components_questionnaire_questionnaire_options';
  info: {
    displayName: 'Questionnaire Options';
  };
  attributes: {
    colorVariants: Schema.Attribute.Component<
      'questionnaire.color-variant',
      true
    >;
    description: Schema.Attribute.Text;
    hasQuantity: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    price: Schema.Attribute.Decimal;
    qImage: Schema.Attribute.Media<'images'>;
    selectOptions: Schema.Attribute.Component<
      'questionnaire.select-option',
      true
    >;
    title: Schema.Attribute.String;
    units: Schema.Attribute.Integer;
  };
}

export interface QuestionnaireQuestions extends Struct.ComponentSchema {
  collectionName: 'components_questionnaire_questions';
  info: {
    displayName: 'questions';
  };
  attributes: {
    description: Schema.Attribute.Text;
    questionOptions: Schema.Attribute.Component<
      'questionnaire.questionnaire-options',
      true
    >;
    questionType: Schema.Attribute.Enumeration<
      [
        'units',
        'range',
        'worktop-style',
        'installation-type',
        'flooring',
        'sink-type',
        'tap-type',
        'storage-type',
        'appliances',
      ]
    >;
    title: Schema.Attribute.Text;
    toolTip: Schema.Attribute.Text;
  };
}

export interface QuestionnaireSelectOption extends Struct.ComponentSchema {
  collectionName: 'components_questionnaire_select_options';
  info: {
    displayName: 'Select Option';
  };
  attributes: {
    label: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    value: Schema.Attribute.String;
  };
}

export interface SectionsBlogPostsTeaser extends Struct.ComponentSchema {
  collectionName: 'components_sections_blog_posts_teasers';
  info: {
    description: '';
    displayName: 'Blog Posts Teaser';
  };
  attributes: {
    posts: Schema.Attribute.Component<'shared.post-teaser', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsCategoryHighlight extends Struct.ComponentSchema {
  collectionName: 'components_sections_category_highlights';
  info: {
    description: '';
    displayName: 'Category Highlight';
  };
  attributes: {
    categories: Schema.Attribute.Component<'shared.category-card', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_sections';
  info: {
    description: '';
    displayName: 'FAQ Section';
  };
  attributes: {
    faqs: Schema.Attribute.Component<'shared.faq-item', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsFeatureGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_feature_grids';
  info: {
    description: '';
    displayName: 'Feature Grid';
  };
  attributes: {
    features: Schema.Attribute.Component<'shared.feature', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsHeroBanner extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_banners';
  info: {
    description: '';
    displayName: 'Hero Banner';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    buttonText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    buttonUrl: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsImageCarousel extends Struct.ComponentSchema {
  collectionName: 'components_sections_image_carousels';
  info: {
    description: '';
    displayName: 'Image Carousel';
  };
  attributes: {
    images: Schema.Attribute.Media<'images', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
  };
}

export interface SectionsProductSlider extends Struct.ComponentSchema {
  collectionName: 'components_sections_product_sliders';
  info: {
    description: '';
    displayName: 'Product Slider';
  };
  attributes: {
    slides: Schema.Attribute.Component<'shared.product-slide', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsPromotionalCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_promotional_ctas';
  info: {
    description: '';
    displayName: 'Promotional CTA';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    buttonText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    buttonUrl: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsRichTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_sections_rich_text_blocks';
  info: {
    description: '';
    displayName: 'Rich Text Block';
  };
  attributes: {
    content: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonials';
  info: {
    description: '';
    displayName: 'Testimonials';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.testimonial', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SharedCategoryCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_category_cards';
  info: {
    description: '';
    displayName: 'Category Card';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    link: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_post_teasers';
  info: {
    description: '';
    displayName: 'Post Teaser';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    link: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    summary: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SharedFeature extends Struct.ComponentSchema {
  collectionName: 'components_shared_features';
  info: {
    description: '';
    displayName: 'Feature';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    icon: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedPostTeaser extends Struct.ComponentSchema {
  collectionName: 'component_shared_post_teasers';
  info: {
    description: '';
    displayName: 'Post Teaser';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    link: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    summary: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SharedProductSlide extends Struct.ComponentSchema {
  collectionName: 'components_shared_product_slides';
  info: {
    description: '';
    displayName: 'Product Slide';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    link: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonials';
  info: {
    description: '';
    displayName: 'Testimonial';
  };
  attributes: {
    authorImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    authorName: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    authorTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    quote: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'questionnaire.color-variant': QuestionnaireColorVariant;
      'questionnaire.questionnaire-options': QuestionnaireQuestionnaireOptions;
      'questionnaire.questions': QuestionnaireQuestions;
      'questionnaire.select-option': QuestionnaireSelectOption;
      'sections.blog-posts-teaser': SectionsBlogPostsTeaser;
      'sections.category-highlight': SectionsCategoryHighlight;
      'sections.faq-section': SectionsFaqSection;
      'sections.feature-grid': SectionsFeatureGrid;
      'sections.hero-banner': SectionsHeroBanner;
      'sections.image-carousel': SectionsImageCarousel;
      'sections.product-slider': SectionsProductSlider;
      'sections.promotional-cta': SectionsPromotionalCta;
      'sections.rich-text-block': SectionsRichTextBlock;
      'sections.testimonials': SectionsTestimonials;
      'shared.category-card': SharedCategoryCard;
      'shared.faq-item': SharedFaqItem;
      'shared.feature': SharedFeature;
      'shared.media': SharedMedia;
      'shared.post-teaser': SharedPostTeaser;
      'shared.product-slide': SharedProductSlide;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.testimonial': SharedTestimonial;
    }
  }
}
