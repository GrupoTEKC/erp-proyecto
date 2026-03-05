<nav style={styles.menu}>

  <Link to="/pedidos" style={styles.link}>
    <button style={styles.button}>
      <span style={styles.icon}>📄</span>
      Nuevo pedido
    </button>
  </Link>

  <Link to="/pedidos/consultar" style={styles.link}>
    <button style={styles.button}>
      <span style={styles.icon}>🔍</span>
      Consultar pedidos
    </button>
  </Link>

  <Link to="/clientes" style={styles.link}>
    <button style={styles.button}>
      <span style={styles.icon}>👥</span>
      Clientes
    </button>
  </Link>

  <Link to="/pagos" style={styles.link}>
    <button style={styles.button}>
      <span style={styles.icon}>💵</span>
      Pagos
    </button>
  </Link>

</nav>
