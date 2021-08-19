import { faBackward, faImages, faMinus, faPlus, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, Col, Container, Form, Nav, Row,  } from "react-bootstrap";
import {  Link, Redirect } from "react-router-dom";
import api, { apiFile, ApiResponse } from "../../api/api";
import { ApiConfig } from "../../Config/api.config";
import PhotoType from "../../types/PhotoType";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface AdministratorDashboardPhotoState {
    isAdministratorLoggedIn: boolean;
    photos: PhotoType[];
}

interface AdministratorDashboardPhotoProporties {
    match: {
        params: {
            aId: number,
        }
    }
}

class AdministratorDashboardPhoto extends React.Component<AdministratorDashboardPhotoProporties> {
    state: AdministratorDashboardPhotoState;

    constructor(props: AdministratorDashboardPhotoProporties | Readonly<AdministratorDashboardPhotoProporties>) {
        super(props)

        this.state = {
            isAdministratorLoggedIn: true,
            photos: [],
        };
    }

    componentDidMount() {
        this.getPhotos();
    }

    componentDidUpdate(oldProps: any) {
        if (this.props.match.params.aId === oldProps) {
            return;
        }

        this.getPhotos();
    }

    private getPhotos() {
        api('/api/article/' + this.props.match.params.aId + '/?join=photos', 'get', {}, 'administrator' )
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }

            this.setState(Object.assign(this.state, {
                photos: res.data.photos,
            }));
        });
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
    }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/administrator/login" />
            );
        }

        return (
            <Container>
            <RoledMainMenu role = 'administrator'></RoledMainMenu>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faImages } /> Photos
                        </Card.Title>

                        <Nav className="mb-3">
                            <Nav.Item>
                                <Link to="/administrator/dashboard/article/" className="btn btn-sm btn-info">
                                    <FontAwesomeIcon icon={ faBackward } /> Go back to articles
                                </Link>
                            </Nav.Item>
                        </Nav>

                        <Row>
                            { this.state.photos.map(this.printSinglePhoto, this) }
                        </Row>

                        <Form.Group className = "mt-5">
                                <p>
                                    <strong>Add a new photo to this article</strong>
                                </p>
                                <Form.Label htmlFor = "add-photo">New article photo</Form.Label>
                                <Form.File 
                                    id = "add-photo">
                                </Form.File>
                        </Form.Group>
                        <Form.Group className = "mt-3">
                            <Button 
                                variant = "primary"
                                onClick = { () => this.doUpload() }>
                                <FontAwesomeIcon icon = { faPlus }></FontAwesomeIcon> Upload photo

                            </Button>
                        </Form.Group>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private printSinglePhoto(photo: PhotoType) {
        return (
            <Col xs = "12" sm = "6" md = "4" lg = "3">
                <Card>
                    <Card.Body>
                        <img 
                            src = { ApiConfig.PHOTO_PATH + "small/" + photo.imagePath } 
                            alt = { "Photo " + photo.photoId }
                            className = "w-100">
                        </img>
                    </Card.Body>
                    <Card.Footer>
                        { this.state.photos.length > 1 ? (
                            <Button 
                                variant = "danger" block 
                                onClick = { () => this.deletePhoto(photo.photoId) }>
                                    <FontAwesomeIcon icon = { faMinus }></FontAwesomeIcon> Delete photo
                                   
                            </Button>
                        ) : '' }
                    </Card.Footer>
                </Card>
            </Col>
        )
    }

    private async doUpload() {
        const filePicker: any = document.getElementById('add-photo');

        if (filePicker?.files.length === 0) {
            return;
        }

        const file = filePicker.files[0];
        await this.uploadArticlePhoto(this.props.match.params.aId, file);
        filePicker.value = '';

        this.getPhotos();
    }

    private async uploadArticlePhoto(articleId: number, file: File) {
        return await apiFile('/api/article/' + articleId + '/uploadPhoto/', 'photo', file, 'administrator');
    }

    private deletePhoto(photoId: number) {
        if (!window.confirm('Are you sure?')) {
            return;
        }

        api('api/article/' + this.props.match.params.aId + '/deletePhoto/' + photoId + '/', 'delete', {}, 'administrator')
            .then((res: ApiResponse) => {
                if (res.status === "error" || res.status === "login") {
                    this.setLogginState(false);
                    return;
                }

                this.getPhotos();
            })
        }
    }

export default AdministratorDashboardPhoto;