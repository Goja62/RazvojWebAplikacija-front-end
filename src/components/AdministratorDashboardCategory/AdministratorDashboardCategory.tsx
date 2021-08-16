import { faEdit, faListAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Container, Form, Modal, Table } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";
import ApiCategoryDto from "../../dtos/ApiCategoryDto.ts";
import CategoryType from "../../types/CategoryType";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface AdministratorDashboarCategorydState {
    isAdministratorLoggedIn: boolean;
    categories: CategoryType[];

    addModal: {
        visible: boolean;
        name: string;
        imagePath: string;
        parentCategoryId: number | null
        message: string
    };

    editModal: {
        categoryId?: number 
        visible: boolean;
        name: string;
        imagePath: string;
        parentCategoryId: number | null
        message: string
    };
}

class AdministratorDashboardCategory extends React.Component {
    state: AdministratorDashboarCategorydState;

    constructor(props: {} | Readonly<{}>) {
        super(props)

        this.state = {
            isAdministratorLoggedIn: true,
            categories: [],

            addModal: {
                visible: false,
                name: '',
                imagePath: '',
                parentCategoryId: null,
                message: '',
            },

            editModal: {
                visible: false,
                name: '',
                imagePath: '',
                parentCategoryId: null,
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

    private setAddModalNumberFiledState(filedName: string, newValue: any) {
        this.setState(Object.assign(this.state, 
            Object.assign(this.state.addModal, {
                [ filedName ]: (newValue === "null") ? null : Number(newValue)
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
        this.getCategories()
    }

    private getCategories() {
        api('/api/category/', 'get', {}, 'administrator' )
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }

            this.putCategoriesInState(res.data)
        });
    }

    private putCategoriesInState(data?: ApiCategoryDto[]) {
        const categories: CategoryType[] | undefined = data?.map(category => {
            return {
                categoryId: category.categoryId,
                name: category.name,
                imagePath: category.imagePath,
                parentCategoryId: category.parentCategoryId
            };
        });

        const newState = Object.assign(this.state, {
            categories: categories,
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
                            <FontAwesomeIcon icon={ faListAlt } /> Categories
                        </Card.Title>

                        <Table hover size = "sm" bordered>
                            <thead>
                                <tr>
                                    <th colSpan = { 3 }></th>
                                    <th className = "text-center">
                                            <Button variant = "primary"  size = "sm" onClick = { () => this.showAddModal() }>
                                                <FontAwesomeIcon icon = { faPlus }></FontAwesomeIcon> Add
                                            </Button> 
                                    </th>
                                </tr>
                                <tr>
                                    <th className = "text-end">ID</th>
                                    <th>Name</th>
                                    <th className = "text-end">Paremt ID</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.categories.map(category => (
                                    <tr>
                                        <td className = "text-end">{ category.categoryId }</td>
                                        <td>{ category.name }</td>
                                        <td className = "text-end">{ category.parentCategoryId }</td>
                                        <td className = "text-center">
                                            <Button variant = "info"  size = "sm"onClick = { () => this.showEditModal(category) }>
                                                <FontAwesomeIcon icon = { faEdit }></FontAwesomeIcon>Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ), this) }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal size = "lg" centered show = { this.state.editModal.visible } onHide = { () => this.setEditModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit category</Modal.Title>
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
                            <Form.Label htmlFor = "imagePath">Image URL</Form.Label>
                            <Form.Control 
                                id = "imagePath" 
                                type = "text" 
                                value = { this.state.editModal.imagePath }
                                onChange = { (e) => this.setEditModalStringFiledState('imagePath', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className = "mb-3">
                            <Form.Label htmlFor = "parentCategoryId">Parent category</Form.Label>
                            <Form.Control 
                                id = "parentCategoryId" 
                                as = "select"
                                value = { this.state.editModal.parentCategoryId?.toString() }
                                onChange={ (e) => this.setEditModalNumberFiledState('parentCategoryId', e.target.value) }>
                                <option value = "null">No parent category</option>
                                { this.state.categories
                                    .filter(category => category.categoryId !== this.state.editModal.categoryId)
                                    .map(category => (
                                    <option value = { category.categoryId?.toString() }>{ category.name }</option>
                                )) }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button 
                                variant = "primary"
                                onClick = { () => this.doEditCategory() }>
                                    <FontAwesomeIcon icon = { faEdit }></FontAwesomeIcon> Edit category
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
        this.setAddModalStringFiledState('imagePath', '');
        this.setAddModalNumberFiledState('parentCategoryId', '');
        this.setAddModalStringFiledState('message', '');
        this.setAddModalVisibleState(true);
    }

    private doAddCategory() {
        api('/api/category/', 'post', {
            name: this.state.addModal.name,
            imagePath: this.state.addModal.imagePath,
            parentCategoryId: this.state.addModal.parentCategoryId,
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
            this.getCategories();
        });
    }

    private showEditModal(category: CategoryType) {
        this.setEditModalStringFiledState('name', String(category.name));
        this.setEditModalStringFiledState('imagePath', String(category.imagePath));
        this.setEditModalNumberFiledState('parentCategoryId', category.parentCategoryId);
        this.setEditModalNumberFiledState('categoryId', category.categoryId)
        this.setEditModalStringFiledState('message', '');
        this.setEditModalVisibleState(true);
    }

    private doEditCategory() {
        api('/api/category/' + this.state.editModal.categoryId, 'patch', {
            name: this.state.editModal.name,
            imagePath: this.state.editModal.imagePath,
            parentCategoryId: this.state.editModal.parentCategoryId,
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

            this.setEditModalVisibleState(false);
            this.getCategories();
        });
    }
}

export default AdministratorDashboardCategory;