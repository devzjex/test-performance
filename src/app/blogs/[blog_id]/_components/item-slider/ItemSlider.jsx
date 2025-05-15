import { Card, Tag } from 'antd';
import './ItemSlider.scss';
import Image from 'next/image';
import MyLink from '@/components/ui/link/MyLink';

const { Meta } = Card;

function ItemSlider(props) {
  const blog = props.blog;

  const renderTitle = (author, title, date) => {
    return (
      <div className="item-title">
        <div className="item-title-content">{title}</div>
        <div className="item-title-author">
          Author: {author} - {date}
        </div>
      </div>
    );
  };

  const renderDescription = (tags) => {
    return (
      <div className="item-desc">
        <div className="item-desc-tag">
          {tags.map((item, index) => (
            <Tag key={index}>{item}</Tag>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="item-slider">
      <MyLink href={`/blogs/${blog.slug}`} className="item-title-link">
        <Card
          cover={
            <div className="image-blog">
              <Image alt="example" src={`https://api-wix.letsmetrix.com` + blog.imagePath} height={200} width={360} />
            </div>
          }
          className="card-blog"
          bordered={false}
        >
          <Meta
            title={renderDescription(blog.tags)}
            description={renderTitle(blog.author, blog.title, new Date(blog.createdAt).toLocaleDateString('en-GB'))}
          />
        </Card>
      </MyLink>
    </div>
  );
}

export default ItemSlider;
