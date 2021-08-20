import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";
import { ApiConfig } from "../../Config/api.config";
import ApiArticleDto from '../../dtos/ApiArticleDto';
import AddToCartInput from "../AddToCartInput/AddToCartInput";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface ArticlePageProporties {
    match: {
        params: {
            aId: number;
        }
    }
}

interface ArticlePageState {
    isUserLoggedIn: boolean;
    message: string;
    article?: ApiArticleDto;
    features: FeatureData[];
}

interface FeatureData {
    name: string;
    value: string;
}

export default class ArticlePage extends React.Component<ArticlePageProporties> {
    state: ArticlePageState;

    constructor(props: ArticlePageProporties | Readonly<ArticlePageProporties>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            message: '',
            features: [],
        }
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        }));
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setArticleData(articleData: ApiArticleDto | undefined) {
        this.setState(Object.assign(this.state, {
            article: articleData,
        }));
    }

    private setFeatureData(featureData: FeatureData[]) {
        this.setState(Object.assign(this.state, {
            features: featureData,
        }));
    }

    componentDidMount() {
        this.getArticleData()
    }


    componentDidUpdate(oldProporties: ArticlePageProporties) {
        if (oldProporties.match.params.aId === this.props.match.params.aId) {
            return;
        }
        this.getArticleData()
    }

    private getArticleData() {
        api('/api/article/' + this.props.match.params.aId , 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLogginState(false);
            }

            if (res.status === 'error') {
                this.setMessage('This article does not exist.');
                this.setFeatureData([]);
                this.setArticleData(undefined);
                return
            }

            const data: ApiArticleDto = res.data;

            this.setArticleData(data);
            this.setMessage('');

            const features: FeatureData[] = [];
            
            for (const articleFeature of data.articleFeatures) {
                const value = articleFeature.value;
                let name =  '';

                for (const feature of data.features) {
                    if (feature.featureId === articleFeature.featureId) {
                        name = feature.name;
                        break;
                    }
                }

                features.push({ name, value });
            } 

            this.setFeatureData(features);
        });
    }

    private printOptionalMessage() {
        if (this.state.message === '') {
            return;
        }

        return (
            <Card.Text>
                { this.state.message }
             </Card.Text>
        )
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return(
                <Redirect to = "/user/login"></Redirect>
            );
        }

        return (
            <Container>
                <RoledMainMenu role = 'user'></RoledMainMenu>

                <Card>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon={ faBoxOpen } /> {
                                this.state.article ?
                                this.state.article?.name :
                                'Article not found'
                            }
                        </Card.Title>

                        { this.printOptionalMessage() }

                        { this.state.article ? this.renderArticleData(this.state.article) : '' }

                       
                    </Card.Body>
                </Card>
            </Container>
        );
    }
    
    private renderArticleData(article: ApiArticleDto) {
        return(
            <Row>
                <Col xs = "12" lg = "8">
                    <div className = "excerpt">
                        { article.excerpt }
                    </div>
                    <hr />
                    <div className = "description">
                        { article.description }
                    </div>
                    <hr />
                    <b>Features:</b><br />

                    <ul>
                        { this.state.features.map(feature => (
                            <li>
                                { feature.name }: { feature.value }
                            </li>
                        ), this) }
                    </ul>
                </Col>
                <Col xs = "12" lg = "4">
                    <Row>
                        <Col xs = "12">
                            <img 
                                src = { ApiConfig.PHOTO_PATH + 'small/' + article.photos[0].imagePath } 
                                alt = { "Photo " + article.photos[0].photoId } 
                                className = 'w-100'>
                            </img>
                        </Col>
                    </Row>
                    <Row>
                        { article.photos.slice(1).map(photo => (
                            <Col xs = "12" sm = "6">
                                <img 
                                    src = { ApiConfig.PHOTO_PATH + 'thumb/' + photo.imagePath } 
                                    alt = { "Photo " + photo.photoId } 
                                    className = 'w-100'>
                                </img>
                            </Col>
                            ), this) }
                    </Row>
                    <Row className = "text-end mb-3">
                        <Col className = "mt-3" xs = "12">
                            <b>Price: { Number(article.articlePrices[article.articlePrices.length - 1].price).toFixed(2) + "EUR"}</b> 
                        </Col>
                    </Row>
                        <Col xs = "12" className = "text-center mb-3">
                            <AddToCartInput article={ article } ></AddToCartInput>
                        </Col>
                    <Row>

                    </Row>
                </Col>
            </Row>
        );
    }
}