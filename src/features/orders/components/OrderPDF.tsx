import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#333",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  contactSection: {
    marginTop: 4,
  },
  contactRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  contactLabel: {
    fontSize: 9,
    color: "#666",
  },
  contactValue: {
    fontSize: 9,
    color: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  label: {
    color: "#666",
  },
  value: {
    fontWeight: "normal",
  },
  bold: {
    fontWeight: "bold",
  },
  table: {
    marginTop: 8,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  col1: { width: "50%" },
  col2: { width: "15%", textAlign: "center" },
  col3: { width: "17.5%", textAlign: "right" },
  col4: { width: "17.5%", textAlign: "right" },
  headerText: {
    fontWeight: "bold",
    fontSize: 10,
  },
  totalSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  twoColumns: {
    flexDirection: "row",
    gap: 20,
  },
  column: {
    flex: 1,
  },
});

const statusConfig: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#fef3c7", color: "#92400e" },
  processing: { bg: "#dbeafe", color: "#1e40af" },
  shipped: { bg: "#f3e8ff", color: "#6b21a8" },
  delivered: { bg: "#dcfce7", color: "#166534" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
};

const SITE_NAME = "Grahok";
const CONTACT_MOBILE = import.meta.env.VITE_CONTACT_MOBILE_NUMBER;
const CONTACT_ADDRESS = import.meta.env.VITE_CONTACT_ADDRESS;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

type OrderItem = {
  name: string;
  product: {
    name: string;
  };
  quantity: number;
  price: number;
};

type Order = {
  customer: {
    name: string;
    mobileNumber: string;
    address: string;
  };
  orderItems: OrderItem[];
  id: number;
  totalPrice: number;
  shippingRegion: string;
  shippingCharge: number;
  orderStatus: string;
  createdAt: Date;
};

type Props = {
  order: Order;
};

export default function OrderPDF({ order }: Props) {
  const subtotal = order.orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const status = statusConfig[order.orderStatus] || {
    bg: "#f3f4f6",
    color: "#374151",
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image src="/logo.png" style={styles.logo} />
            <View>
              <Text style={styles.brandName}>{SITE_NAME}</Text>
              <View style={styles.contactSection}>
                <View style={styles.contactRow}>
                  <Text style={styles.contactLabel}>Mobile: </Text>
                  <Text style={styles.contactValue}>{CONTACT_MOBILE}</Text>
                </View>
                <View style={styles.contactRow}>
                  <Text style={styles.contactLabel}>Address: </Text>
                  <Text style={styles.contactValue}>{CONTACT_ADDRESS}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 16 }}>
            <View>
              <Text style={styles.title}>Order #{order.id}</Text>
              <Text style={styles.subtitle}>Placed on {formatDate(order.createdAt)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.color }]}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{order.customer.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{order.customer.mobileNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{order.customer.address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shipping Region:</Text>
            <Text style={styles.value}>{order.shippingRegion || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Product</Text>
              <Text style={[styles.col2, styles.headerText]}>Qty</Text>
              <Text style={[styles.col3, styles.headerText]}>Price</Text>
              <Text style={[styles.col4, styles.headerText]}>Total</Text>
            </View>
            {order.orderItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.col1}>{item.product.name}</Text>
                <Text style={styles.col2}>{item.quantity}</Text>
                <Text style={styles.col3}>{formatCurrency(item.price)}</Text>
                <Text style={styles.col4}>{formatCurrency(item.price * item.quantity)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shipping</Text>
            <Text style={styles.value}>
              {order.shippingCharge > 0 ? formatCurrency(order.shippingCharge) : "Free"}
            </Text>
          </View>
          <View style={[styles.row, styles.totalSection]}>
            <Text style={styles.bold}>Total</Text>
            <Text style={styles.bold}>{formatCurrency(order.totalPrice)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
