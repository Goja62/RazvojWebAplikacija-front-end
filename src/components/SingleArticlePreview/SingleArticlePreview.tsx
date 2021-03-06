import React from "react";
import { Card, Col, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ApiConfig } from "../../Config/api.config";
import { ArticleType } from "../../types/ArticleType";
import AddToCartInput from "../AddToCartInput/AddToCartInput";

interface SingleArticlePreviewProperties {
    article: ArticleType,
}



export default class SingleArticlePreview extends React.Component<SingleArticlePreviewProperties> {
    render() {
        return (
            <Col lg = "4" md = "6" sm = "6" xs = "12">
                <Card className="mb-3">
                    <Card.Header>
                        <img alt = { this.props.article.name } src = { ApiConfig.PHOTO_PATH + 'small/' + this.props.article.imageUrl} className = "w-100"></img>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title as = "p">
                            <strong>{  this.props.article.name }</strong>
                        </Card.Title>
                        <Card.Text>
                            {  this.props.article.excerpt }
                        </Card.Text>
                        <Card.Text>
                            Price: { Number( this.props.article.price).toFixed(2) } EUR
                        </Card.Text>

                        <AddToCartInput article = { this.props.article}></AddToCartInput>
                        
                        <Link to = { `/article/${  this.props.article.articleId }`} className =  "btn btn-primary w-100 btn-sm">Open article page</Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}