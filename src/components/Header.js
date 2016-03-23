import React, { Component } from 'react';
import { Link } from 'react-router';
import { Navbar, NavbarBrand } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from '../style/header.css';

@CSSModules(styles)
export default class Header extends Component {
  render() {
    const { styles } = this.props;

    return (
      <Navbar className={styles.navbar}>
        <NavbarBrand className={styles['navbar-brand']}>
          <span className={styles['navbar-team']}>Mud Dohgs</span>
          <span className={styles['navbar-section']}>Schedule</span>
        </NavbarBrand>
      </Navbar>
    );
  }
}
