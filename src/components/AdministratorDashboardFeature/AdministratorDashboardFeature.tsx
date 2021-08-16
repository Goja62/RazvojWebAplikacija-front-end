import { faBackward, faEdit, faListUl, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Container, Form, Modal, Table } from "react-bootstrap";
import {  Link, Redirect } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";
import ApiFeatureDto from "../../dtos/ApiFeatureDto";
import FeatureType from "../../types/FeatureType";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface AdministratorDashboardFeatureState {
    isAdministratorLoggedIn: boolean;
    features: FeatureType[];

    addModal: {
        visible: boolean;
        name: string;
        message: string
    };

    editModal: {
        featureId?: number 
        visible: boolean;
        name: string;
        message: string
    };
}

interface AdministratorDashboardFeatureProporties {
    match: {
        params: {
            cId: number,
        }
    }
}

class AdministratorDashboardFeature extends React.Component<AdministratorDashboardFeatureProporties> {
    state: AdministratorDashboardFeatureState;

    constructor(props: AdministratorDashboardFeatureProporties | Readonly<AdministratorDashboardFeatureProporties>) {
        super(props)

        this.state = {
            isAdministratorLoggedIn: true,
            features: [],

            addModal: {
                visible: false,
                name: '',
                message: '',
            },

            editModal: {
                visible: false,
                name: '',
                message: '',
            }
        }
    }

    private setAddModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state, 
            Object.assign(this.state.addModal, {
                visible: newState
            })
        ));
    }

    private setAddModalStringFiledState(filedName: string, newValue: string) {
        this.setState(Object.assign(this.state, 
            Object.assign(this.state.addModal, {
                [ filedName ]: newValue
            })
        ));
    }

    private setEditModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state, 
            Object.assign(this.state.editModal, {
                visible: newState
            })
        ));
    }

    private setEditModalStringFiledState(filedName: string, newValue: string) {
        this.setState(Object.assign(this.state, 
            Object.assign(this.state.editModal, {
                [ filedName ]: newValue
            })
        ));
    }

    private setEditModalNumberFiledState(filedName: string, newValue: any) {
        this.setState(Object.assign(this.state, 
            Object.assign(this.state.editModal, {
                [ filedName ]: (newValue === "null") ? null : Number(newValue)
            })
        ));
    }

    componentDidMount() {
        this.getFeatures();
    }

    componentDidUpdate(oldProps: any) {
        if (this.props.match.params.cId === oldProps) {
            return;
        }

        this.getFeatures();
    }

    private getFeatures() {
        api('/api/feature/?filter=categoryId||$eq||' + this.props.match.params.cId, 'get', {}, 'administrator' )
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }

            this.putFeaturesInState(res.data)
        });
    }

    private putFeaturesInState(data?: ApiFeatureDto[]) {
        const features: FeatureType[] | undefined = data?.map(feature => {
            return {
                featureId: feature.featureId,
                name: feature.name,
                categoryId: feature.categoryId,
            };
        });

        const newState = Object.assign(this.state, {
            features: features,
        });

        this.setState(newState);
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        });

        this.setState(newState);
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
                            <FontAwesomeIcon icon={ faListUl } /> Features
                        </Card.Title>

                        <Table hover size = "sm" bordered>
                            <thead>
                                <tr>
                                    <th colSpan = { 4 }>
                                        <Link to="/administrator/dashboard/category/" 
                                            className="btn btn-sm btn-secondary">
                                            <FontAwesomeIcon icon={ faBackward } /> Back to categories
                                        </Link>
                                    </th>
                                    <th className = "text-center">
                                        <Button variant = "primary"  size = "sm" onClick = { () => this.showAddModal() }>
                                            <FontAwesomeIcon icon = { faPlus }></FontAwesomeIcon> Add
                                        </Button> 
                                    </th>
                                </tr>
                                <tr>
                                    <th className = "text-end">ID</th>
                                    <th>Name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.features.map(feature => (
                                    <tr>
                                        <td className = "text-end">{ feature.featureId }</td>
                                        <td>{ feature.name }</td>
                                        <td className = "text-center" >
                                            <Button variant = "info"  size = "sm" onClick = { () => this.showEditModal(feature) }>
                                                <FontAwesomeIcon icon = { faEdit }></FontAwesomeIcon> Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ), this) }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal size = "lg" centered show = { this.state.addModal.visible } onHide = { () => this.setAddModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new feature</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label htmlFor = "name">Name</Form.Label>
                                <Form.Control 
                                    id = "name" 
                                    type = "text" 
                                    value = { this.state.addModal.name }
                                    onChange = { (e) => this.setAddModalStringFiledState('name', e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Button 
                                    variant = "primary"
                                    onClick = { () => this.doAddFeature() }>
                                        <FontAwesomeIcon icon = { faPlus }></FontAwesomeIcon> Add new feature
                                </Button>
                            </Form.Group>
                            { this.state.addModal.message ? (<Alert variant = "danger" value = { this.state.addModal.message }></Alert>) : '' }
                        </Modal.Body>
                </Modal>

                <Modal size = "lg" centered show = { this.state.editModal.visible } onHide = { () => this.setEditModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit feature</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor = "name">Name</Form.Label>
                            <Form.Control 
                                id = "name" 
                                type = "text" 
                                value = { this.state.editModal.name }
                                onChange = { (e) => this.setEditModalStringFiledState('name', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button
                                variant = "primary"
                                onClick = { () => this.doEditFeature() }>
                                    <FontAwesomeIcon icon = { faEdit }></FontAwesomeIcon> Edit feature
                            </Button>
                        </Form.Group>
                        { this.state.editModal.message ? (<Alert variant = "danger" value = { this.state.editModal.message }></Alert>) : '' }
                    </Modal.Body>
                </Modal>
            </Container>
        );
    }

    private showAddModal() {
        this.setAddModalStringFiledState('name', '');
        this.setAddModalStringFiledState('message', '');
        this.setAddModalVisibleState(true);
    }

    private doAddFeature() {
        api('/api/feature/', 'post', {
            name: this.state.addModal.name,
            categoryId: this.props.match.params.cId,
        }, 'administrator')
        api('/api/category/', 'get', {}, 'administrator' )
        .then((res: ApiResponse) => {
            if (res.status === "login") {
                this.setLogginState(false);
                return;
            }

            if (res.status === "error") {
                this.setAddModalStringFiledState('message', JSON.stringify(res.data))
                return;
            }

            this.setAddModalVisibleState(false);
            this.getFeatures();
        });
    }

    private showEditModal(feature: FeatureType) {
        this.setEditModalStringFiledState('name', String(feature.name));
        this.setEditModalNumberFiledState('featureId', feature.featureId.toString())
        this.setEditModalStringFiledState('message', '');
        this.setEditModalVisibleState(true);
    }

    private doEditFeature() {
        api('/api/feature/' + String(this.state.editModal.featureId), 'patch', {
            name: this.state.editModal.name,
            categoryId: this.props.match.params.cId,
        }, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "login") {
                this.setLogginState(false);
                return;
            }

            if (res.status === "error") {
                this.setAddModalStringFiledState('message', JSON.stringify(res.data))
                return;
            }

            this.setEditModalVisibleState(false);
            this.getFeatures();
        });
    }
}

export default AdministratorDashboardFeature;