import type { Result } from './types';
import { money } from './format';

type ProductCardProps = {
  product: Result['products'][number];
  index: number;
  onDetails: (id: string) => void;
};

export default function ProductCard({
  product,
  index,
  onDetails,
}: ProductCardProps) {
  return (
    <article className="product">
      <div className={'product-art ' + product.color}>
        <span className="product-badge">
          {index % 2 === 0 ? 'Yeni sezon' : 'Seçili ürün'}
        </span>
        <svg
          viewBox="0 0 300 200"
          aria-label={`${product.color} ayakkabı illüstrasyonu`}
          role="img"
        >
          <ellipse
            cx="154"
            cy="164"
            rx="117"
            ry="10"
            fill="#000"
            opacity=".07"
          />
          <path
            d="M38 139 Q31 130 47 109 L72 64 Q78 55 89 71 L115 101 Q147 96 162 81 L185 118 L250 135 Q267 140 261 155 L46 155 Q35 153 38 139"
            className="shoe"
          />
          <path
            d="M38 141 Q130 152 263 143 L261 159 Q150 172 40 160Z"
            fill="#fff"
            stroke="#c1c4c8"
          />
          <path
            d="M115 104 L150 119 M125 98 L161 113 M139 94 L171 108"
            stroke="#a9aeb4"
            strokeWidth="5"
          />
          <path
            d="M75 111 Q100 151 160 131 L195 117"
            fill="none"
            stroke="#f27a1a"
            strokeWidth="8"
          />
        </svg>
        <span className="product-id">{product.id} · Örnek görsel</span>
      </div>
      <div className="product-info">
        <p>
          <button
            className="product-link"
            onClick={() => onDetails(product.id)}
          >
            <strong>{product.brand}</strong> {product.name}
          </button>
        </p>
        <div className="rating">
          ★ <b>{product.rating}</b> <span>({product.reviews})</span>
        </div>
        <div className="price">{money(product.price)}</div>
        <small>
          {product.color} · {product.sizes.join(' / ')} beden stokta
        </small>
        <button className="detail-button" onClick={() => onDetails(product.id)}>
          Ürünü incele →
        </button>
      </div>
    </article>
  );
}
